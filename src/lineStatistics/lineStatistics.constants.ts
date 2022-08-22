import { Locale, Validity } from './lineStatistics.types';

export const validityCategoryLabel = (locale?: Locale) => ({
  [Validity.EXPIRED]: textForLocale('Utgåtte linjer', 'Expired lines', locale),
  [Validity.VALID]: textForLocale('Gyldige linjer', 'Valid lines', locale),
  [Validity.EXPIRING]: textForLocale(
    'Utgående linjer',
    'Expiring lines',
    locale,
  ),
  [Validity.ALL]: textForLocale('Alle linjer', 'All lines', locale),
});

export const errorText = (locale?: Locale) => ({
  missingLineStatisticsFromOperatorPortal: textForLocale(
    'Kunne ikke laste inn linjestatus for Operatørpotalen. Viser kun linjestatus for Nplan.',
    'Could not load line statistics from operator portal. Showing only line statistics from Nplan.',
    locale,
  ),
  missingLineStatisticsFromNplan: textForLocale(
    'Kunne ikke laste inn linjestatus for Nplan. Viser kun linjestatus for Operatørpotalen.',
    'Could not load line statistics from Nplan. Showing only line statistics from operator portal.',
    locale,
  ),
  failedToLoadData: textForLocale(
    'Kunne ikke laste inn dataene. Prøv igjen senere.',
    'Could not load data. Try again later.',
    locale,
  ),
  failedToLoadLatestDate: textForLocale(
    'Oops!! Noen gikk galt.',
    'Oops!! Something went wrong.',
    locale,
  ),
});

export const infoText = (locale?: Locale) => ({
  foundNot: function (something: string) {
    return textForLocale(`Fant ingen ${(something ?? '').toLowerCase()}`, `No ${(something ?? '').toLowerCase()} found`, locale)
  },
  noLinesFound: textForLocale('Fant ingen linjer', 'No lines found', locale),
  noLinesFoundInfo: textForLocale(
    'Last opp nytt datasett i Operatørportalen eller opprett linjer i Nplan.',
    'Upload new dataset in Operator portal or create lines in Nplan.',
    locale,
  ),
});

export const titleText = (locale?: Locale) => ({
  sortLines: textForLocale('Sorter linjer', 'Sort lines', locale),
  selectLines: textForLocale('Velg linjer ', 'Select lines', locale),
  lineStatisticsFromNplan: textForLocale(
    'Linjestatus fra NPlan',
    'Line statistics from Nplan',
    locale,
  ),
  lineStatisticsFromChouette: textForLocale(
    'Linjestatus for rutedata',
    'Line statistics for timetable data',
    locale,
  ),
  numberOfLines: textForLocale('Antall linjer', 'Number of lines', locale),
  showAll: textForLocale('Vis alle', 'Show all', locale),
  latestDeliveryDate: textForLocale(
    'Dato for siste leveranse',
    'Latest delivery date',
    locale,
  ),
  daysToFirstExpiringLine: textForLocale(
    'Dager til første utgående linje',
    'Days to first outgoing line',
    locale,
  ),
  days: textForLocale('dager', 'days', locale),
  numberOfDays: textForLocale('Antall dager', 'Number of days', locale),
  back: textForLocale('tilbake', 'back', locale),
  showAllLinesFromNplan: textForLocale('Vis alle linjer fra Nplan', 'Show all lines from nplan', locale),
  allLinesFromNplan: textForLocale('Alle linjer fra Nplan', 'All lines from nplan', locale),
  noLongerValid: function (lineNumber: string, numberOfDays: number) {
    return textForLocale(`Linje ${lineNumber} er ikke gyldig lenger.`, `Line ${lineNumber} is no longer valid.`, locale)
  },
  expiringLine: function (lineNumber: string, numberOfDays: number) {
    return textForLocale(`Linje ${lineNumber} utløper om ${numberOfDays} dager.`, `Line ${lineNumber} is expiring in ${numberOfDays} days.`, locale)
  },
  validLine: function (lineNumber: string, numberOfDays: number) {
    return textForLocale(`Linje ${lineNumber} har gyldige data for ${numberOfDays} dager.`, `Line ${lineNumber} has valid data for ${numberOfDays} days.`, locale)
  },
});

const textForLocale = (
  norwegianText: string,
  englishText: string,
  locale?: Locale,
) => (locale === Locale.NO ? norwegianText : englishText);
