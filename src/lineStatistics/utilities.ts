import {
  DaysValid,
  Line,
  LinesMap,
  LineStatistics,
  LineStatisticsResponse,
  PeriodValidity,
  Validity,
  ValidityCategory,
} from './lineStatistics.types';
import moment from 'moment';
import { Moment } from 'moment/moment';

export const getValidityNameFromLabel = (value: string) => {
  return Object.entries(Validity).find(([key, val]) => val === value)?.[0];
};

const sortValidityCategories = (validityCategories: ValidityCategory[]) =>
  validityCategories.sort((a, b) =>
    a.numDaysAtLeastValid < b.numDaysAtLeastValid ? -1 : 1,
  );

const findValidityCategoryForGivenValidity = (
  lineStats: LineStatisticsResponse,
  validity: Validity,
): ValidityCategory => {
  return (
    lineStats.validityCategories.find(
      (category) => category.name === getValidityNameFromLabel(validity),
    ) || {
      name: validity,
      lineNumbers: [],
      numDaysAtLeastValid: 0,
    }
  );
};

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

const validDays = (linesMap: LinesMap) => {
  const lineNumbers = Object.keys(linesMap);
  return lineNumbers.map((lineNumber) => {
    return { lineNumber: lineNumber, days: linesMap[lineNumber].daysValid };
  });
};

const minDays = (daysValid: DaysValid[]) => {
  let days = Math.min(...daysValid.map((line) => line.days));
  return {
    days: days === Infinity ? 0 : days,
    validity: findValidity(days),
  };
};

export const formatLineStats = (
  lineStats: LineStatisticsResponse,
): LineStatistics | undefined => {
  try {
    const sortedValidityCategories = sortValidityCategories(
      lineStats.validityCategories,
    );
    let startDateLine: Moment = moment(lineStats.startDate, 'YYYY-MM-DD');
    let endDateLine: Moment = moment(startDateLine).add(lineStats.days, 'days');

    let linesMap: LinesMap = {};

    lineStats.publicLines.forEach((publicLine) => {
      let publicLineValidPeriod: Moment | undefined = undefined;

      const effectivePeriodsFormatted: PeriodValidity[] =
        publicLine.effectivePeriods.map((effectivePeriod) => {
          const effectivePeriodFrom = moment(
            effectivePeriod.from,
            'YYYY-MM-DD',
          );
          const effectivePeriodTo = moment(effectivePeriod.to, 'YYYY-MM-DD');

          const timelineStartPosition =
            findTimeLineStartPositionForEffectivePeriod(
              effectivePeriodFrom,
              startDateLine,
              lineStats.days,
            );

          const timelineEndPosition = findTimeLineEndPositionForEffectivePeriod(
            effectivePeriodTo,
            endDateLine,
            lineStats.days,
          );

          let daysForward = (timelineEndPosition / 100) * lineStats.days;
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
        timeTables: line.timetables.map((timetable) => ({
          ...timetable,
          periods: timetable.periods.map((period) => ({
            ...period,
            timelineStartPosition: findTimeLineStartPositionForTimeTable(
              period.from,
              startDateLine,
              lineStats.days,
            ),
            timelineEndPosition: findTimeLineEndPositionForTimeTable(
              period.to,
              endDateLine,
              lineStats.days,
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

    const daysValid: DaysValid[] = validDays(linesMap);

    return {
      invalid: findValidityCategoryForGivenValidity(
        lineStats,
        Validity.INVALID,
      ),
      valid: findValidityCategoryForGivenValidity(lineStats, Validity.VALID),
      expiring: findValidityCategoryForGivenValidity(
        lineStats,
        Validity.EXPIRING,
      ),
      validity: sortedValidityCategories,
      all: {
        lineNumbers: sortedValidityCategories.flatMap(
          (lines) => lines.lineNumbers,
        ),
      },
      startDate: startDateLine.format('YYYY-MM-DD'),
      days: lineStats.days,
      endDate: endDateLine.format('YYYY-MM-DD'),
      linesMap: linesMap,
      validDaysOffset: 33,
      validFromDate: moment(startDateLine)
        .add(120, 'days')
        .format('YYYY-MM-DD'),
      daysValid: daysValid,
      minDays: minDays(daysValid),
    };
  } catch (e) {
    console.error('error in getLineStats', e);
  }
};

export const sortLines = (
  sorting: number,
  lineData: LineStatistics,
  selectedValidityCategory: string,
) => {
  const linesNumbersForSelectedValidityCategory = filterLines(
    lineData,
    selectedValidityCategory,
  );

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
      const daysAsc = sortDaysValidInLineStatistics(lineData, true);
      return daysAsc
        .filter(
          (line) =>
            linesNumbersForSelectedValidityCategory.indexOf(line.lineNumber) !==
            -1,
        )
        .map((line) => line.lineNumber);
    case 4:
      const daysDesc = sortDaysValidInLineStatistics(lineData, false);
      return daysDesc
        .filter(
          (line) =>
            linesNumbersForSelectedValidityCategory.indexOf(line.lineNumber) !==
            -1,
        )
        .map((line) => line.lineNumber);
  }
};

export const filterLines = (
  lineData: LineStatistics,
  selectedValidity: string,
) => {
  console.log('selectedValidity', selectedValidity);

  return (
    lineData.validity.find((validity) => validity.name === selectedValidity) ||
    lineData.all
  ).lineNumbers;
};

export const sortDaysValidInLineStatistics = (
  lineData: LineStatistics,
  ascending = true,
): DaysValid[] => {
  return lineData.daysValid.slice().sort((a, b) => {
    if (a.days === b.days) {
      return 0;
    } else if (a.days < b.days) {
      return ascending ? -1 : 1;
    } else {
      return ascending ? 1 : -1;
    }
  });
};
