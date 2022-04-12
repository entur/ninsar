import { useEffect, useState } from 'react';
import { Provider } from '../lineStatistics.types';
import { useAuth } from '../../appProvider';
import { GraphQLClient } from 'graphql-request';
import { calculateExportedLineStatistics } from '../lineStatisticsCalculator/exportedLineStatisticsCalculator';
import {
  ExportedLineStatisticsResponse,
  ExportedPublicLine,
  FetchError,
  LineStatisticsPerProviderId,
} from './lineStatistics.response.types';

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

  const getLineForProviderQuery = `
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
          headers: { authorization: `Bearer ${accessToken}` },
        });
        const response = await client.request<{
          lineStatistics: ExportedLineStatisticsResponse;
        }>(getLineForProviderQuery);

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
          const formatted = calculateExportedLineStatistics({
            ...response.lineStatistics,
            publicLines: publicLinesPerProviderCode[providerCode],
          });
          lineStatisticsPerProviderId = {
            ...lineStatisticsPerProviderId,
            [providers?.find((provider) => provider.code === providerCode)
              ?.id ?? providerCode]: formatted,
          };
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
  }, [getToken, providers]);

  return {
    exportedLineStatisticsForAllProviders,
    exportedLineStatisticsForAllProvidersError,
  };
};
