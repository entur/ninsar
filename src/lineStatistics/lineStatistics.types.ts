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
  code: string;
  name: string;
}

export interface PeriodValidity extends Period {
  timelineEndPosition: number;
  timelineStartPosition: number;
  validationLevel?: Validity; // TODO: Trenger vi det ?
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

export interface PublicLineValidity extends PublicLine {
  daysValid: number;
}
