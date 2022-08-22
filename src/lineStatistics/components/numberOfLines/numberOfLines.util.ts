import { LineStatistics, Validity } from '../../lineStatistics.types';
import { NumberOfLinesType } from '../pieStatistics/pieStatistics.types';

const numberOfLinesForValidityCategory = (
  validity: Validity,
  lineStatistics?: LineStatistics,
  exportedLineStatistics?: LineStatistics,
) =>
  (lineStatistics?.validityCategories.get(validity)?.length ?? 0) +
  (exportedLineStatistics?.validityCategories.get(validity)?.length ?? 0);

export const getNumberOfLinesType = (
  lineStatistics?: LineStatistics,
  exportedLineStatistics?: LineStatistics,
): NumberOfLinesType => ({
  totalNumberOfLines: numberOfLinesForValidityCategory(
    Validity.ALL,
    lineStatistics,
    exportedLineStatistics,
  ),
  numberOfValidLines: numberOfLinesForValidityCategory(
    Validity.VALID,
    lineStatistics,
    exportedLineStatistics,
  ),
  numberOfExpiredLines: numberOfLinesForValidityCategory(
    Validity.EXPIRED,
    lineStatistics,
    exportedLineStatistics,
  ),
  numberOfExpiringLines: numberOfLinesForValidityCategory(
    Validity.EXPIRING,
    lineStatistics,
    exportedLineStatistics,
  ),
});
