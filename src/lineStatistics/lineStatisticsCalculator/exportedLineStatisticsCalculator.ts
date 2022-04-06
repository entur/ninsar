import moment from 'moment';
import { Moment } from 'moment/moment';
import {
  ExportedLineStatisticsResponse, LineNumbers,
  LinesMap,
  LineStatistics,
  PeriodValidity,
  Timetable,
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

export const calculateExportedLineStatistics = (
  exportedLineStatisticsResponse: ExportedLineStatisticsResponse,
): LineStatistics => {
  const startDateLine: Moment = moment(
    exportedLineStatisticsResponse.startDate,
    'YYYY-MM-DD',
  );
  const endDateLine: Moment = moment(startDateLine).add(180, 'days');

  const requiredValidityDate = moment(startDateLine)
    .add(120, 'days')
    .format('YYYY-MM-DD');

  let linesMap: LinesMap = {};
  let validityCategories: { [validity: string]: string[] } = {};

  const validityCategoryMap = new Map<Validity, LineNumbers>();

  exportedLineStatisticsResponse.lines.map((line, lineIndex) => {
    const effectivePeriodFrom: Moment = moment(
      line.operatingPeriodFrom,
      'YYYY-MM-DD',
    );
    const effectivePeriodTo: Moment = moment(
      line.operatingPeriodTo,
      'YYYY-MM-DD',
    );

    const timelineStartPosition: number =
      findTimeLineStartPositionForEffectivePeriod(
        effectivePeriodFrom,
        startDateLine,
        180,
      );

    const timelineEndPosition: number =
      findTimeLineEndPositionForEffectivePeriod(
        effectivePeriodTo,
        endDateLine,
        180,
      );

    let daysForward = (timelineEndPosition / 100) * 180;
    const validationLevel: Validity = findValidity(daysForward);

    const effectivePeriodFormatted: PeriodValidity = {
      from: line.operatingPeriodFrom,
      to: line.operatingPeriodTo,
      timelineStartPosition,
      timelineEndPosition,
      validationLevel,
    };

    validityCategoryMap.set(validationLevel, [
      ...(validityCategoryMap.get(validationLevel) ?? []),
      line.publicCode,
    ]);
    validityCategoryMap.set(Validity.ALL, [
      ...(validityCategoryMap.get(Validity.ALL) ?? []),
      line.publicCode,
    ]);

    const publicLineValidPeriod = validPeriod(
      startDateLine,
      effectivePeriodFrom,
      effectivePeriodTo,
    );

    const daysValid: number =
      getDaysRange(startDateLine, publicLineValidPeriod) || 0;

    const timetables: Timetable[] = line.exportedDayTypesStatistics.map(
      (dayType, dayTypeIndex) => ({
        id: dayTypeIndex,
        objectId: dayType.dayTypeNetexId,
        periods: [
          {
            to: dayType.operatingPeriodTo,
            from: dayType.operatingPeriodFrom,
            timelineStartPosition: findTimeLineStartPositionForTimeTable(
              dayType.operatingPeriodFrom,
              startDateLine,
              180,
            ),
            timelineEndPosition: findTimeLineEndPositionForTimeTable(
              dayType.operatingPeriodTo,
              endDateLine,
              180,
            ),
          },
        ],
      }),
    );

    linesMap = {
      ...linesMap,
      [line.publicCode]: {
        lineNumber: line.publicCode,
        lineNames: [line.lineName],
        effectivePeriods: [effectivePeriodFormatted],
        lines: [
          {
            timetables: timetables,
          },
        ],
        daysValid: daysValid,
      },
    };
  });

  return {
    validityCategories: validityCategoryMap,
    linesMap: linesMap,
    startDate: startDateLine.format('YYYY-MM-DD'),
    endDate: endDateLine.format('YYYY-MM-DD'),
    requiredValidityDate: requiredValidityDate,
  };
};
