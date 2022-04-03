import {
  Line,
  LinesMap,
  LineStatistics,
  LineStatisticsResponse,
  PeriodValidity,
  Validity,
} from './lineStatistics.types';
import moment from 'moment';
import { Moment } from 'moment/moment';

const findTimeLineStartPositionForEffectivePeriod = (
  effectivePeriodFrom: Moment,
  startDateLine: Moment,
  days: number,
) => {
  const fromDiff = startDateLine.diff(effectivePeriodFrom, 'days', true);
  return fromDiff > 0 ? 0 : (Math.abs(fromDiff) / days) * 100;
};

const findTimeLineEndPositionForEffectivePeriod = (
  effectivePeriodTo: Moment,
  endDateLine: Moment,
  days: number,
) => {
  const toDiff = moment(endDateLine, 'YYYY-MM-DD').diff(
    moment(effectivePeriodTo).add(1, 'days'),
    'days',
    true,
  );
  return Math.max(toDiff > 0 ? 100 - toDiff / (days / 100) : 100, 0);
};

const findTimeLineStartPositionForTimeTable = (
  periodFrom: string,
  startDateLine: Moment,
  days: number,
) => {
  const fromDiff = startDateLine.diff(
    moment(periodFrom, 'YYYY-MM-DD'),
    'days',
    true,
  );

  return fromDiff < 0 ? (Math.abs(fromDiff) / days) * 100 : 0;
};

const findTimeLineEndPositionForTimeTable = (
  periodTo: string,
  endDateLine: Moment,
  days: number,
) => {
  const toDiff = moment(endDateLine, 'YYYY-MM-DD').diff(
    moment(periodTo, 'YYYY-MM-DD').add(1, 'days'),
    'days',
    true,
  );
  return Math.max(toDiff > 0 ? 100 - toDiff / (days / 100) : 100, 0);
};

const findValidity = (daysForward: number) => {
  if (daysForward < 0 || daysForward === Infinity) {
    return Validity.INVALID;
  } else if (daysForward >= 120) {
    return Validity.VALID;
  }
  return Validity.EXPIRING;
};

const validPeriod = (
  startDate: Moment,
  effectivePeriodFrom: Moment,
  effectivePeriodTo: Moment,
) =>
  moment(startDate)
    .add(1, 'days')
    .isBetween(effectivePeriodFrom, effectivePeriodTo, 'days', '[]')
    ? effectivePeriodTo
    : startDate;

const getDaysRange = (
  startDate: Moment,
  end: Moment | undefined,
): number | undefined =>
  end && moment.isMoment(end) ? end.diff(startDate, 'days') : end;

export const formatLineStats = (
  lineStatisticsResponse: LineStatisticsResponse,
): LineStatistics | undefined => {
  try {
    const startDateLine: Moment = moment(
      lineStatisticsResponse.startDate,
      'YYYY-MM-DD',
    );
    const endDateLine: Moment = moment(startDateLine).add(
      lineStatisticsResponse.days,
      'days',
    );

    let linesMap: LinesMap = {};

    lineStatisticsResponse.publicLines.forEach((publicLine) => {
      let publicLineValidPeriod: Moment | undefined = undefined;

      const effectivePeriodsFormatted: PeriodValidity[] =
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

      const lines: Line[] = publicLine.lines.map((line) => ({
        ...line,
        timetables: line.timetables.map((timetable) => ({
          ...timetable,
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

      linesMap = {
        ...linesMap,
        [publicLine.lineNumber]: {
          ...publicLine,
          daysValid: daysValid,
          effectivePeriods: effectivePeriodsFormatted,
          lines: lines,
        },
      };
    });

    return {
      lineNumbersForValidityCategories: [
        ...lineStatisticsResponse.validityCategories.map(
          (validityCategory) => ({
            validity: validityCategory.name,
            lineNumbers: validityCategory.lineNumbers,
          }),
        ),
        {
          validity: Validity.ALL,
          lineNumbers: Object.keys(linesMap),
        },
      ],
      startDate: startDateLine.format('YYYY-MM-DD'),
      endDate: endDateLine.format('YYYY-MM-DD'),
      linesMap: linesMap,
      validFromDate: moment(startDateLine)
        .add(120, 'days')
        .format('YYYY-MM-DD'),
    };
  } catch (e) {
    console.error('error in getLineStats', e);
  }
};

export const sortLines = (
  sorting: number,
  lineStatistics: LineStatistics,
  selectedValidityCategory: Validity,
) => {
  const linesNumbersForSelectedValidityCategory =
    lineStatistics.lineNumbersForValidityCategories.find(
      (validityCategory) =>
        validityCategory.validity === selectedValidityCategory,
    )?.lineNumbers;

  if (linesNumbersForSelectedValidityCategory) {
    switch (sorting) {
      default:
        return linesNumbersForSelectedValidityCategory;
      case 1:
        return [...linesNumbersForSelectedValidityCategory].sort((a, b) => {
          return a.localeCompare(b, 'nb', {
            numeric: true,
            sensitivity: 'base',
          });
        });
      case 2:
        return [...linesNumbersForSelectedValidityCategory].sort((a, b) => {
          return b.localeCompare(a, 'nb', {
            numeric: true,
            sensitivity: 'base',
          });
        });
      case 3:
        const daysAsc = sortDaysValidInLineStatistics(lineStatistics, true);
        return daysAsc
          .filter(
            (lineNumber) =>
              linesNumbersForSelectedValidityCategory.indexOf(lineNumber) !==
              -1,
          )
          .map((lineNumber) => lineNumber);
      case 4:
        const daysDesc = sortDaysValidInLineStatistics(lineStatistics, false);
        return daysDesc
          .filter(
            (lineNumber) =>
              linesNumbersForSelectedValidityCategory.indexOf(lineNumber) !==
              -1,
          )
          .map((lineNumber) => lineNumber);
    }
  }
};

export const sortDaysValidInLineStatistics = (
  lineStatistics: LineStatistics,
  ascending = true,
): string[] => {
  return Object.keys(lineStatistics.linesMap)
    .map((lineNumber) => ({
      lineNumber: lineNumber,
      daysValid: lineStatistics.linesMap[lineNumber].daysValid,
    }))
    .sort((a, b) => {
      if (a.daysValid === b.daysValid) {
        return 0;
      } else if (a.daysValid < b.daysValid) {
        return ascending ? -1 : 1;
      } else {
        return ascending ? 1 : -1;
      }
    })
    .map((val) => val.lineNumber);
};
