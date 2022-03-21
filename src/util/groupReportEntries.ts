import { SEVERITY, ValidationReportEntry } from '../model/ValidationReport';

type GroupedEntry = {
  count: number;
  severity: SEVERITY;
  groupedEntries?: Map<keyof ValidationReportEntry, GroupedEntry>;
  entries?: ValidationReportEntry[];
};

export const groupReportEntries = (
  entries: ValidationReportEntry[],
  field: keyof ValidationReportEntry,
  subField?: keyof ValidationReportEntry,
): Map<keyof ValidationReportEntry, GroupedEntry> => {
  const groupedReportEntries = entries.reduce((entryMap, entry) => {
    const current = entryMap.get(entry[field]);
    const severity = getSeverity(current?.severity, entry.severity);
    const entries = current?.entries || [];
    entries.push(entry);
    entryMap.set(entry[field], {
      severity,
      entries,
    });
    return entryMap;
  }, new Map());
  return postProcess(groupedReportEntries, subField);
};

export const postProcess = (
  grouped: Map<keyof ValidationReportEntry, GroupedEntry>,
  subField?: keyof ValidationReportEntry,
): Map<keyof ValidationReportEntry, GroupedEntry> => {
  grouped.forEach((groupedEntry) => {
    if (subField) {
      groupedEntry.groupedEntries = groupedEntry.entries
        ? groupReportEntries(groupedEntry.entries, subField)
        : undefined;
    }

    groupedEntry.count = groupedEntry.entries?.length || 0;
  });
  return grouped;
};

const getSeverity = (current: SEVERITY, next: SEVERITY) => {
  if (current > next) {
    return current;
  } else {
    return next;
  }
};
