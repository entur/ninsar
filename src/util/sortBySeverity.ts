import { SEVERITY } from '../model/ValidationReport';

const SEVERITY_LEVELS = ['INFO', 'WARNING', 'ERROR'];

export const sortBySeverity = (a: SEVERITY, b: SEVERITY) => {
  return SEVERITY_LEVELS.indexOf(b) - SEVERITY_LEVELS.indexOf(a);
};
