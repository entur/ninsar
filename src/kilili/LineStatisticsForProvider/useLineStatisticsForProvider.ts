import { LineStatisticsPerProviderId } from '../../lineStatistics/apiHooks/lineStatistics.response.types';
import { useEffect, useState } from 'react';
import {
  Line,
  LineNumbers,
  LinesMap,
  LineStatistics,
  PeriodValidity,
  Validity,
} from '../../lineStatistics/lineStatistics.types';
import moment, { Moment } from 'moment/moment';
import {
  findTimeLineEndPositionForEffectivePeriod, findTimeLineEndPositionForTimeTable,
  findTimeLineStartPositionForEffectivePeriod,
  findTimeLineStartPositionForTimeTable,
  findValidity,
  getDaysRange,
  validPeriod,
} from '../../lineStatistics/lineStatisticsCalculator/utilities';

type Type = (providerId: number) => {
  lineStatistics: LineStatistics | undefined
  loading: boolean;
  error: Error | null;
};

const GRAPHQL_ENDPOINT = 'http://localhost:8080/graphql';

const LINE_STATISTICS_QUERY = `
  query LineStatisticsForProvider($providerId: Int) {
    lineStatisticsForProvider(providerId: $providerId) {
        providerId
        startDate
        days
        validityCategories {
          name
          lineNumbers
        }
        publicLines {
          lineNumber
          lineNames
          effectivePeriods {
            from
            to
          }
        }
      }
    }
`;

const mapLines = (lineStatisticsResponse: any) => {
  const startDateLine: Moment = moment(
    lineStatisticsResponse.startDate,
    'YYYY-MM-DD',
  );
  const endDateLine: Moment = moment(startDateLine).add(
    lineStatisticsResponse.days,
    'days',
  );
  const lines = lineStatisticsResponse.publicLines
    // @ts-ignore
    .map((publicLine) => {
      let publicLineValidPeriod: Moment | undefined = undefined;

      const effectivePeriodsFormatted: PeriodValidity[] =
        // @ts-ignore
        publicLine.effectivePeriods.map((effectivePeriod) => {
          const effectivePeriodFrom: Moment = moment(
            effectivePeriod.from,
            'YYYY-MM-DD',
          );
          const effectivePeriodTo: Moment = moment(
            effectivePeriod.to,
            'YYYY-MM-DD',
          );

          const timelineStartPosition: number =
            findTimeLineStartPositionForEffectivePeriod(
              effectivePeriodFrom,
              startDateLine,
              lineStatisticsResponse.days,
            );

          const timelineEndPosition = findTimeLineEndPositionForEffectivePeriod(
            effectivePeriodTo,
            endDateLine,
            lineStatisticsResponse.days,
          );

          let daysForward =
            (timelineEndPosition / 100) * lineStatisticsResponse.days;
          const validationLevel = findValidity(daysForward);

          publicLineValidPeriod = validPeriod(
            publicLineValidPeriod || startDateLine,
            effectivePeriodFrom,
            effectivePeriodTo,
          );

          return {
            ...effectivePeriod,
            timelineStartPosition,
            timelineEndPosition,
            validationLevel,
          };
        });

      const daysValid: number =
        getDaysRange(startDateLine, publicLineValidPeriod) || 0;
// @ts-ignore
      const lines: Line[] = [];

      return {
        [publicLine.lineNumber]: {
          ...publicLine,
          daysValid: daysValid,
          effectivePeriods: effectivePeriodsFormatted,
          lines: lines,
        },
      };
    })
    // @ts-ignore
    .reduce((result, obj) => ({ ...result, ...obj }), {});

  return {
    startDateLine,
    endDateLine,
    lines
  };

}

export const useLineStatisticsForProvider: Type = (providerId: number) => {
  const [lineStatistics, setLineStatistics] = useState<LineStatistics | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLineStatistics = async () => {
      try {
        setLoading(true);

        const response = await fetch(GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: LINE_STATISTICS_QUERY,
            variables: {
              providerId
            }
          }),
        });

        if (!response.ok) {
          throw new Error(`GraphQL request failed with status ${response.status}`);
        }

        const { data, errors } = await response.json();

        if (errors) {
          throw new Error(errors.map((e: any) => e.message).join(', '));
        }

        const {
          startDateLine,
          endDateLine,
          lines: linesMap
        } = mapLines(data.lineStatisticsForProvider);

        const validityCategories = new Map<Validity, LineNumbers>();
        const allLineNumbers: LineNumbers = [];

        data.lineStatisticsForProvider.validityCategories.forEach((category: any) => {
          validityCategories.set(category.name, category.lineNumbers);
          allLineNumbers.push(...category.lineNumbers);
        });

        validityCategories.set(Validity.ALL, allLineNumbers);

        // Transform the response into the expected format
        const transformedData: LineStatistics = {
          startDate: startDateLine.format('YYYY-MM-DD'),
          endDate: endDateLine.format('YYYY-MM-DD'),
          requiredValidityDate: moment(startDateLine)
            .add(120, 'days')
            .format('YYYY-MM-DD'),
          linesMap,
          validityCategories,
        };

        console.log(transformedData);

        setLineStatistics(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        throw err;
      } finally {
        setLoading(false);
      }
    };

    fetchLineStatistics();
  }, [providerId]);

  return {
    lineStatistics,
    loading,
    error
  };
};
