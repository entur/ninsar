import { useEffect, useState } from 'react';
import { Provider } from '../lineStatistics.types';
import { GraphQLClient } from 'graphql-request';
import { calculateExportedLineStatistics } from '../lineStatisticsCalculator/exportedLineStatisticsCalculator';
import {
  ExportedLineStatisticsResponse,
  ExportedPublicLine,
  FetchError,
  LineStatisticsPerProviderId,
} from './lineStatistics.response.types';
import { useAuth } from '../../appContext';

export const useExportedLineStatisticsForAllProviders = (
  providers?: Provider[],
) => {
  const { getToken } = useAuth();

  const [
    exportedLineStatisticsForAllProviders,
    setExportedLineStatisticsForAllProviders,
  ] = useState<LineStatisticsPerProviderId>();
  const [
    exportedLineStatisticsForAllProvidersError,
    setExportedLineStatisticsForAllProvidersError,
  ] = useState<FetchError | undefined>();

  const getLinesForAllProvidersQuery = `
  query GetExportedLineStatistics {
    lineStatistics {
      startDate
      publicLines {
        providerCode
        publicCode
        operatingPeriodTo
        operatingPeriodFrom
        lines {
          lineName
          operatingPeriodTo
          operatingPeriodFrom
          exportedDayTypesStatistics {
            dayTypeNetexId
            operatingPeriodTo
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
        const client = new GraphQLClient(endpoint, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Et-Client-Name': 'entur-ninsar'
          },
        });
        const response = await client.request<{
          lineStatistics: ExportedLineStatisticsResponse;
        }>(getLinesForAllProvidersQuery);

        const publicLinesPerProviderCode =
          response.lineStatistics.publicLines.reduce(
            (
              result: { [providerCode: string]: ExportedPublicLine[] },
              exportedPublicLine,
            ) => ({
              ...result,
              [exportedPublicLine.providerCode]: (
                result[exportedPublicLine.providerCode] || []
              ).concat(exportedPublicLine),
            }),
            {},
          );

        let lineStatisticsPerProviderId: LineStatisticsPerProviderId = {};
        for (const providerCode in publicLinesPerProviderCode) {
          const publicLinesForProvider =
            publicLinesPerProviderCode[providerCode];
          if (publicLinesForProvider.length > 0) {
            const formatted = calculateExportedLineStatistics({
              ...response.lineStatistics,
              publicLines: publicLinesForProvider,
            });
            lineStatisticsPerProviderId = {
              ...lineStatisticsPerProviderId,
              [providers?.find((provider) => provider.code === providerCode)
                ?.id ?? providerCode]: formatted,
            };
          }
        }
        setExportedLineStatisticsForAllProviders(lineStatisticsPerProviderId);
        setExportedLineStatisticsForAllProvidersError(undefined);
      } catch (error: any) {
        setExportedLineStatisticsForAllProvidersError({
          status: error.status,
          statusText: error.error,
        });
      }
    };
    if (providers) {
      fetchLinesForProvider();
    }
  }, [getToken, providers, getLinesForAllProvidersQuery]);

  return {
    exportedLineStatisticsForAllProviders,
    exportedLineStatisticsForAllProvidersError,
  };
};
