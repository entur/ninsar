import { LineStatisticsPerProviderId } from '../../lineStatistics/apiHooks/lineStatistics.response.types';
import { useCallback, useEffect, useState } from 'react';
import {
  Line,
  LineNumbers,
  LinesMap,
  LineStatistics,
  PeriodValidity, PublicLineValidity,
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

type Type = (providerId: number, lineStatistics: LineStatistics) => {
  fetchPublicLineValidity: (lineNumber: string) => void;
  mergedLineStatistics: LineStatistics;
  loading: boolean;
  error: Error | null;
};

const GRAPHQL_ENDPOINT = 'http://localhost:8080/graphql';

const LINE_STATISTICS_QUERY = `
  query LineStatisticsForProvider($providerId: Int, $lineNumbers: [String!]) {
    lineStatisticsForProvider(providerId: $providerId) {
        providerId
        publicLines(lineNumbers: $lineNumbers) {
          lineNumber
          lineNames
          effectivePeriods {
            from
            to
          }
          lines {
            objectId
            name
            timetables {
              objectId
              periods {
                from
                to
              }
            }
          }
        }
      }
    }
`;

const mapPublicLineValidity = (lineStatisticsResponse: any): PublicLineValidity => {
  const startDateLine: Moment = moment(
    lineStatisticsResponse.startDate,
    'YYYY-MM-DD',
  );
  const endDateLine: Moment = moment(startDateLine).add(
    lineStatisticsResponse.days,
    'days',
  );

  const publicLine = lineStatisticsResponse.publicLines[0];

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

      //@ts-ignore
      const lines: Line[] = publicLine.lines.map((line) => ({
        ...line,
        //@ts-ignore
        timetables: line.timetables.map((timetable) => ({
          ...timetable,
          //@ts-ignore
          periods: timetable.periods.map((period) => ({
            ...period,
            timelineStartPosition: findTimeLineStartPositionForTimeTable(
              period.from,
              startDateLine,
              lineStatisticsResponse.days,
            ),
            timelineEndPosition: findTimeLineEndPositionForTimeTable(
              period.to,
              endDateLine,
              lineStatisticsResponse.days,
            ),
          })),
        })),
      }));

      return {
          ...publicLine,
          daysValid: daysValid,
          effectivePeriods: effectivePeriodsFormatted,
          lines: lines,
      };
}

export const useLineStatisticsPublicLineDetails: Type = (providerId: number, lineStatistics: LineStatistics) => {
  const [mergedLineStatistics, setMergedLineStatistics] = useState<LineStatistics>(lineStatistics);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPublicLineValidity = useCallback((lineNumber: string) => {
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
              providerId,
              lineNumbers: [lineNumber]
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

        const mappedPublicLineValidity = mapPublicLineValidity(data.lineStatisticsForProvider);

        setMergedLineStatistics({
          ...lineStatistics,
          linesMap: {
            ...lineStatistics.linesMap,
            [lineNumber]: mappedPublicLineValidity
          }
        });

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
    fetchPublicLineValidity,
    mergedLineStatistics,
    loading,
    error
  };
};
