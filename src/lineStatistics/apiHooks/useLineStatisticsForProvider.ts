import { useEffect, useState } from 'react';
import {
  Line,
  LineNumbers,
  LineStatistics,
  PeriodValidity,
  Validity,
} from '../lineStatistics.types';
import moment, { Moment } from 'moment/moment';
import {
  findTimeLineEndPositionForEffectivePeriod,
  findTimeLineStartPositionForEffectivePeriod,
  findValidity,
  getDaysRange,
  validPeriod,
} from '../lineStatisticsCalculator/utilities';
import { useAuth } from '../../appContext';
import { FetchError } from './lineStatistics.response.types';

type Type = (providerId: string) => {
  lineStatistics: LineStatistics | undefined;
  loading: boolean;
  error: FetchError | null;
};

const GRAPHQL_ENDPOINT = process.env.REACT_APP_KILILI_API_URL;

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
    lines,
  };
};

export const useLineStatisticsForProvider: Type = (providerId: string) => {
  const { getToken } = useAuth();
  const [lineStatistics, setLineStatistics] = useState<
    LineStatistics | undefined
  >();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FetchError | null>(null);

  useEffect(() => {
    const fetchLineStatistics = async () => {
      try {
        setLoading(true);

        const response = await fetch(GRAPHQL_ENDPOINT!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await getToken!()}`,
            'Et-Client-Name': 'entur-ninsar',
          },
          body: JSON.stringify({
            query: LINE_STATISTICS_QUERY,
            variables: {
              providerId: Number(providerId),
            },
          }),
        });

        if (!response.ok) {
          throw new Error(
            `GraphQL request failed with status ${response.status}`,
            {
              cause: {
                status: response.status,
                statusText: response.statusText,
              },
            },
          );
        }

        const { data, errors } = await response.json();

        if (errors) {
          throw new Error(errors.map((e: any) => e.message).join(', '), {
            cause: {
              status: response.status,
              statusText: errors.map((e: any) => e.message).join(', '),
            },
          });
        }

        const {
          startDateLine,
          endDateLine,
          lines: linesMap,
        } = mapLines(data.lineStatisticsForProvider);

        const validityCategories = new Map<Validity, LineNumbers>();
        const allLineNumbers: LineNumbers = [];

        data.lineStatisticsForProvider.validityCategories.forEach(
          (category: any) => {
            validityCategories.set(category.name, category.lineNumbers);
            allLineNumbers.push(...category.lineNumbers);
          },
        );

        validityCategories.set(Validity.ALL, allLineNumbers);

        // Transform the response into the expected format
        const transformedData: LineStatistics = {
          providerName: data.lineStatisticsForProvider.providerName,
          startDate: startDateLine.format('YYYY-MM-DD'),
          endDate: endDateLine.format('YYYY-MM-DD'),
          requiredValidityDate: moment(startDateLine)
            .add(120, 'days')
            .format('YYYY-MM-DD'),
          linesMap,
          validityCategories,
        };
        setLineStatistics(transformedData);
      } catch (err) {
        setError((err as Error).cause as FetchError);
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
    error,
  };
};
