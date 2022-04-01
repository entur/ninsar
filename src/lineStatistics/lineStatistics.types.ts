export interface LineStatisticsResponse {
  days: number;
  publicLines: PublicLine[];
  startDate: string;
  validityCategories: ValidityCategory[];
}

export interface LineStatistics {
  all: { lineNumbers: string[] };
  days: number;
  daysValid: DaysValid[];
  endDate: string;
  expiring: ValidityCategory;
  invalid: ValidityCategory;
  linesMap: LinesMap;
  minDays: { days: number; validity: Validity };
  startDate: string;
  valid: ValidityCategory;
  validDaysOffset: number;
  validFromDate: string;
  validity: ValidityCategory[];
}

export type LinesMap = { [lineNumber: string]: PublicLineValidity };

export interface DaysValid {
  lineNumber: string;
  days: number;
}

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

export interface ValidityCategory {
  numDaysAtLeastValid: number;
  lineNumbers: string[];
  name: Validity;
}

export enum Validity {
  INVALID = 'Invalid lines',
  VALID = 'Valid lines',
  EXPIRING = 'Expiring lines',
  ALL = 'all',
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
