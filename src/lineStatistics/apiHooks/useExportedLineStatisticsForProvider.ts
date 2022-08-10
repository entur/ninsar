import { useEffect, useState } from 'react';
import { LineStatistics, Provider } from '../lineStatistics.types';
import { useAuth } from '../../appContext';
import { GraphQLClient } from 'graphql-request';
import { calculateExportedLineStatistics } from '../lineStatisticsCalculator/exportedLineStatisticsCalculator';
import {
  ExportedLineStatisticsResponse,
  FetchError,
} from './lineStatistics.response.types';

export const useExportedLineStatisticsForProvider = (provider?: Provider) => {
  const { getToken } = useAuth();

  const [exportedLineStatistics, setExportedLineStatistics] =
    useState<LineStatistics>();
  const [exportedLineStatisticsError, setExportedLineStatisticsError] =
    useState<FetchError | undefined>();

  const getLineForProviderQuery = `
  query GetExportedLineStatistics($providerCode: ID!) {
    lineStatistics(providerCode: $providerCode) {
      startDate,
      publicLines {
        providerCode
        publicCode,
        operatingPeriodTo,
        operatingPeriodFrom,
        lines {
          lineName,
          operatingPeriodTo,
          operatingPeriodFrom,
          exportedDayTypesStatistics {
            dayTypeNetexId,
            operatingPeriodTo,
            operatingPeriodFrom
            serviceJourneyName
          }
        }
      }
    }
  }`;

  useEffect(() => {
    const fetchLinesForProvider = async () => {
      const accessToken = getToken ? await getToken() : '';
      const endpoint = `${process.env.REACT_APP_UTTU_API_URL}`;

      try {
        if (provider) {
          const client = new GraphQLClient(endpoint, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Et-Client-Name': 'entur-ninsar'
            },
          });
          const response = await client.request<{
            lineStatistics: ExportedLineStatisticsResponse;
          }>(getLineForProviderQuery, { providerCode: provider.code });

          setExportedLineStatistics(
            calculateExportedLineStatistics(response.lineStatistics)
          );
          setExportedLineStatisticsError(undefined);
        }
      } catch (error: any) {
        setExportedLineStatisticsError({
          status: error.status,
          statusText: error.error,
        });
      }
    };
    if (provider) {
      fetchLinesForProvider();
    }
  }, [getToken, provider, getLineForProviderQuery]);

  return {
    exportedLineStatistics,
    exportedLineStatisticsError,
  };
};
