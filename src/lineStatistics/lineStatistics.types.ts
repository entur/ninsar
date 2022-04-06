// Response from Marduk
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

// Response from Uttu
export interface ExportedLineStatisticsResponse {
  startDate: string;
  lines: ExportedLine[];
}

export interface ExportedDayTypeStatisticsResponse {
  operatingPeriodTo: string;
  operatingPeriodFrom: string;
  dayTypeNetexId: string;
}

export interface ExportedLine {
  lineName: string;
  publicCode: string;
  providerCode: string;
  operatingPeriodTo: string;
  operatingPeriodFrom: string;
  exportedDayTypesStatistics: ExportedDayTypeStatisticsResponse[];
}

export type LineNumbers = string[];

export interface LineStatistics {
  startDate: string;
  endDate: string;
  requiredValidityDate: string;

  linesMap: LinesMap;
  validityCategories: Map<Validity, LineNumbers>;
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
  validationLevel?: Validity; // TODO: Trenger vi det ?
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
  id: number; // TODO: Trenger vi det
  objectId: string;
  periods: Period[] | PeriodValidity[];
}

export interface Line {
  id?: number; // TODO: Trenger vi det
  name?: string; // TODO: Trenger vi det
  timetables: Timetable[];
}

export interface PublicLine {
  lineNumber: string;
  lineNames: string[];
  effectivePeriods: Period[] | PeriodValidity[];
  lines: Line[];
}
