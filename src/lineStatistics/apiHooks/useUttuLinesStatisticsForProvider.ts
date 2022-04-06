import { useEffect, useState } from 'react';
import {
  ExportedLineStatisticsResponse,
  FetchError,
  Provider,
} from '../lineStatistics.types';
import { useAuth } from '../../appProvider';
import { GraphQLClient } from 'graphql-request';
import { calculateExportedLineStatistics } from '../lineStatisticsCalculator/exportedLineStatisticsCalculator';

export const useUttuLinesStatisticsForProvider = (
  providerId: string | undefined,
) => {
  const { getToken } = useAuth();

  const [allProviders, setAllProviders] = useState<Provider[] | undefined>();
  const [allProvidersError, setAllProvidersError] = useState<
    FetchError | undefined
  >();

  const getLineForProviderQuery = `
  query GetExportedLineStatistics($providerCode: ID!) {
    lineStatistics(providerCode: $providerCode) {
      startDate,
      lines {
        lineName,
        providerCode
        publicCode,
        operatingPeriodTo,
        operatingPeriodFrom,
        exportedDayTypesStatistics {
          operatingPeriodTo,
          operatingPeriodFrom,
          dayTypeNetexId
        }      
      }
    }
  }`;

  useEffect(() => {
    const fetchLinesForProvider = async () => {
      const accessToken = getToken ? await getToken() : '';
      const endpoint = `${process.env.REACT_APP_UTTU_API_URL}`;

      const client = new GraphQLClient(endpoint, {
        headers: { authorization: `Bearer ${accessToken}` },
      });
      const response = await client.request<{
        lineStatistics: ExportedLineStatisticsResponse;
      }>(getLineForProviderQuery, {
        providerCode: providerId,
      });

      console.log('providerId', providerId);
      console.log('response', response);
      console.log(
        'calculateExportedLineStatistics',
        calculateExportedLineStatistics(response.lineStatistics),
      );
    };
    fetchLinesForProvider();
  }, [getToken]);

  return { allProviders, allProvidersError };
};
