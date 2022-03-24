export interface FormattedLineStatistics {
  all: { lineNumbers: string[] };
  days: number;
  daysValid: { lineNumber: string; days: number }[];
  endDate: string;
  expiring: ValidityCategory;
  invalid: ValidityCategory;
  linesMap: { [key: string]: PublicLineValidity }; //Map<string, PublicLineValidity>;
  minDays: { days: number; validity: Validity };
  startDate: string;
  valid: ValidityCategory;
  validDaysOffset: number;
  validFromDate: string;
  validity: ValidityCategory[];
}

interface PublicLineValidity extends PublicLine {
  daysValid: number;
}

export interface LineStatistics {
  days: number;
  publicLines: PublicLine[];
  startDate: string;
  validityCategories: ValidityCategory[];
}

export interface ValidityCategory {
  numDaysAtLeastValid: number;
  lineNumbers: string[];
  name: Validity;
}

export enum Validity {
  INVALID,
  VALID,
  EXPIRING,
}

export interface Period {
  from: string;
  to: string;
}

export interface Timetable {
  id: number;
  objectId: string;
  periods: Period[];
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
  effectivePeriods: Period[];
  lines: Line[];
}
