import { Validity } from './lineStatistics.types';

export const validityCategoryLabel = {
  [Validity.INVALID]: 'Utgåtte linjer',
  [Validity.VALID]: 'Gyldige linjer',
  [Validity.EXPIRING]: 'Utgående linjer',
  [Validity.ALL]: 'Alle linjer',
};
