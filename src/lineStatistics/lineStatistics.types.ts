export interface LineStatistics {
  all: { lineNumbers: string[] };
  days: number;
  daysValid: { lineNumber: string; days: number }[];
  endDate: string;
  expiring: ValidityCategory;
  invalid: ValidityCategory;
  linesMap: { [lineNumber: string]: PublicLineValidity };
  minDays: { days: number; validity: Validity };
  startDate: string;
  valid: ValidityCategory;
  validDaysOffset: number;
  validFromDate: string;
  validity: ValidityCategory[];
}

export interface Provider {
  id: number;
  name: string;
}

export type FetchError = {
  status: number;
  statusText: string;
};

interface PublicLineValidity extends PublicLine {
  daysValid: number;
}

interface ValidityCategory {
  numDaysAtLeastValid: number;
  lineNumbers: string[];
  name: Validity;
}

enum Validity {
  INVALID,
  VALID,
  EXPIRING,
}

interface Period {
  from: string;
  to: string;
}

interface Timetable {
  id: number;
  objectId: string;
  periods: Period[];
}

interface Line {
  id: number;
  objectId: string;
  name: string;
  timetables: Timetable[];
}

interface PublicLine {
  lineNumber: string;
  lineNames: string[];
  effectivePeriods: Period[];
  lines: Line[];
}