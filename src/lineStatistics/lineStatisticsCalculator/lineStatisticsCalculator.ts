import moment, { Moment } from 'moment';
import {
  Line,
  LineNumbers,
  LinesMap,
  LineStatistics,
  PeriodValidity,
  Validity,
} from '../lineStatistics.types';
import {
  findTimeLineEndPositionForEffectivePeriod,
  findTimeLineEndPositionForTimeTable,
  findTimeLineStartPositionForEffectivePeriod,
  findTimeLineStartPositionForTimeTable,
  findValidity,
  getDaysRange,
  validPeriod,
} from './utilities';
import { LineStatisticsResponse } from '../apiHooks/lineStatistics.response.types';

export const calculateLineStatistics = (
  lineStatisticsResponse: LineStatisticsResponse,
): LineStatistics => {
  const startDateLine: Moment = moment(
    lineStatisticsResponse.startDate,
    'YYYY-MM-DD',
  );
  const endDateLine: Moment = moment(startDateLine).add(
    lineStatisticsResponse.days,
    'days',
  );

  // const linesMap: LinesMap = lineStatisticsResponse.publicLines
  //   .map((publicLine) => {
  //     let publicLineValidPeriod: Moment | undefined = undefined;

  //     const effectivePeriodsFormatted: PeriodValidity[] =
  //       publicLine.effectivePeriods.map((effectivePeriod) => {
  //         const effectivePeriodFrom: Moment = moment(
  //           effectivePeriod.from,
  //           'YYYY-MM-DD',
  //         );
  //         const effectivePeriodTo: Moment = moment(
  //           effectivePeriod.to,
  //           'YYYY-MM-DD',
  //         );

  //         const timelineStartPosition: number =
  //           findTimeLineStartPositionForEffectivePeriod(
  //             effectivePeriodFrom,
  //             startDateLine,
  //             lineStatisticsResponse.days,
  //           );

  //         const timelineEndPosition = findTimeLineEndPositionForEffectivePeriod(
  //           effectivePeriodTo,
  //           endDateLine,
  //           lineStatisticsResponse.days,
  //         );

  //         let daysForward =
  //           (timelineEndPosition / 100) * lineStatisticsResponse.days;
  //         const validationLevel = findValidity(daysForward);

  //         publicLineValidPeriod = validPeriod(
  //           publicLineValidPeriod || startDateLine,
  //           effectivePeriodFrom,
  //           effectivePeriodTo,
  //         );

  //         return {
  //           ...effectivePeriod,
  //           timelineStartPosition,
  //           timelineEndPosition,
  //           validationLevel,
  //         };
  //       });

  //     const daysValid: number =
  //       getDaysRange(startDateLine, publicLineValidPeriod) || 0;

  //     const lines: Line[] = publicLine.lines.map((line) => ({
  //       ...line,
  //       timetables: line.timetables.map((timetable) => ({
  //         ...timetable,
  //         periods: timetable.periods.map((period) => ({
  //           ...period,
  //           timelineStartPosition: findTimeLineStartPositionForTimeTable(
  //             period.from,
  //             startDateLine,
  //             lineStatisticsResponse.days,
  //           ),
  //           timelineEndPosition: findTimeLineEndPositionForTimeTable(
  //             period.to,
  //             endDateLine,
  //             lineStatisticsResponse.days,
  //           ),
  //         })),
  //       })),
  //     }));

  //     return {
  //       [publicLine.lineNumber]: {
  //         ...publicLine,
  //         daysValid: daysValid,
  //         effectivePeriods: effectivePeriodsFormatted,
  //         lines: lines,
  //       },
  //     };
  //   })
  //   .reduce((result, obj) => ({ ...result, ...obj }), {});

  const validityCategoriesMap = new Map<Validity, LineNumbers>();

  lineStatisticsResponse.validityCategories.forEach((category) => {
    validityCategoriesMap.set(category.name, [
      ...(validityCategoriesMap.get(category.name) ?? []),
      ...category.lineNumbers,
    ]);
  });

  // validityCategoriesMap.set(Validity.ALL, [
  //   ...(validityCategoriesMap.get(Validity.ALL) ?? []),
  //   // ...Object.keys(linesMap),
  // ]);

  return {
    validityCategories: validityCategoriesMap,
    startDate: startDateLine.format('YYYY-MM-DD'),
    endDate: endDateLine.format('YYYY-MM-DD'),
    // linesMap: linesMap,
    linesMap: {},
    requiredValidityDate: moment(startDateLine)
      .add(120, 'days')
      .format('YYYY-MM-DD'),
  };
};
