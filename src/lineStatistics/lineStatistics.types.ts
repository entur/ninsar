export interface LineStatisticsResponse {
  days: number;
  publicLines: PublicLine[];
  startDate: string;
  validityCategories: {
    numDaysAtLeastValid?: number;
    lineNumbers: string[];
    name: Validity;
  }[];
}

export interface LineStatistics {
  startDate: string;
  endDate: string;
  validFromDate: string;

  linesMap: LinesMap;
  lineNumbersForValidityCategories: LineNumbersForValidityCategory[];
}

export interface LineNumbersForValidityCategory {
  lineNumbers: string[];
  validity: Validity;
}

export type LinesMap = { [lineNumber: string]: PublicLineValidity };

export interface Provider {
  id: number;
  name: string;
}

export type FetchError = {
  status: number;
  statusText: string;
};

export interface PeriodValidity extends Period {
  timelineEndPosition: number;
  timelineStartPosition: number;
  validationLevel?: Validity;
}

export interface PublicLineValidity extends PublicLine {
  daysValid: number;
}

export enum Validity {
  INVALID = 'INVALID',
  VALID = 'VALID',
  EXPIRING = 'EXPIRING',
  ALL = 'ALL',
}

export interface Period {
  from: string;
  to: string;
}

export interface Timetable {
  id: number;
  objectId: string;
  periods: Period[] | PeriodValidity[];
}

export interface Line {
  id: number;
  objectId: string;
  name: string;
  timetables: Timetable[];
}

export interface PublicLine {
  lineNumber: string;
  lineNames: string[];
  effectivePeriods: Period[] | PeriodValidity[];
  lines: Line[];
}
