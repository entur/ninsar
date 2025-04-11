import { LineStatistics, PublicLine, Validity } from '../lineStatistics.types';

export type FetchError = {
  status: number;
  statusText: string;
};

// Response from Marduk
export interface LineStatisticsResponse {
  days: number;
  publicLines: PublicLine[];
  startDate: string;
  validityCategories: {
    numDaysAtLeastValid?: number;
    lineNumbersCount: number;
    lineNumbers: string[];
    name: Validity;
  }[];
}

export type LineStatisticsPerProviderId = {
  [providerId: string]: LineStatistics;
};

// Response from Uttu
export interface ExportedLineStatisticsResponse {
  startDate: string;
  publicLines: ExportedPublicLine[];
}

export interface ExportedPublicLine {
  publicCode: string;
  providerCode: string;
  operatingPeriodTo: string;
  operatingPeriodFrom: string;
  lines: ExportedLine[];
}

export interface ExportedDayTypeStatisticsResponse {
  operatingPeriodTo: string;
  operatingPeriodFrom: string;
  dayTypeNetexId: string;
  serviceJourneyName: string;
}

export interface ExportedLine {
  lineName: string;
  operatingPeriodTo: string;
  operatingPeriodFrom: string;
  exportedDayTypesStatistics: ExportedDayTypeStatisticsResponse[];
}

// Providers response
export interface ProviderResponse {
  id: number;
  name: string;
  chouetteInfo: {
    migrateDataToProvider: number;
    referential: string;
  };
}

export interface LatestDeliveryDateResponse {
  state: string;
  date: number;
  fileName: string;
}
