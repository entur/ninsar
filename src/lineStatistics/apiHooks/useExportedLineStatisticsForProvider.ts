import { useEffect, useState } from 'react';
import { Provider } from '../lineStatistics.types';
import { useAuth } from '../../appProvider';
import { GraphQLClient } from 'graphql-request';
import { calculateExportedLineStatistics } from '../lineStatisticsCalculator/exportedLineStatisticsCalculator';
import {
  ExportedLineStatisticsResponse,
  FetchError,
  LineStatisticsPerProviderId,
} from './lineStatistics.response.types';

export const useExportedLineStatisticsProvider = (provider?: Provider) => {
  const { getToken } = useAuth();

  const [
    exportedLineStatisticsForAllProviders,
    setExportedLineStatisticsForAllProviders,
  ] = useState<LineStatisticsPerProviderId>();
  const [
    exportedLineStatisticsForAllProvidersError,
    setExportedLineStatisticsForAllProvidersError,
  ] = useState<FetchError | undefined>();

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
            headers: { authorization: `Bearer ${accessToken}` },
          });
          const response = await client.request<{
            lineStatistics: ExportedLineStatisticsResponse;
          }>(getLineForProviderQuery, { providerCode: provider.code });

          setExportedLineStatisticsForAllProviders({
            [provider.id]: calculateExportedLineStatistics(
              response.lineStatistics,
            ),
          });
          setExportedLineStatisticsForAllProvidersError(undefined);
        }
      } catch (error: any) {
        setExportedLineStatisticsForAllProvidersError({
          status: error.status,
          statusText: error.error,
        });
      }
    };
    if (provider) {
      fetchLinesForProvider();
    }
  }, [getToken, provider]);

  return {
    exportedLineStatisticsForAllProviders,
    exportedLineStatisticsForAllProvidersError,
  };
};
