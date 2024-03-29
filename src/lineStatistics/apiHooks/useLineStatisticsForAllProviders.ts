import { useEffect, useState } from 'react';
import { useAuth } from '../../appContext';
import { calculateLineStatistics } from '../lineStatisticsCalculator/lineStatisticsCalculator';
import {
  FetchError,
  LineStatisticsPerProviderId,
  LineStatisticsResponse,
} from './lineStatistics.response.types';

export const useLineStatisticsForAllProviders = () => {
  const { getToken } = useAuth();

  const [lineStatisticsForAllProviders, setLineStatisticsForAllProviders] =
    useState<LineStatisticsPerProviderId | undefined>();
  const [
    lineStatisticsForAllProvidersError,
    setLineStatisticsForAllProvidersError,
  ] = useState<FetchError | undefined>();

  useEffect(() => {
    const fetchReport = async () => {
      const accessToken = getToken ? await getToken() : '';
      const response = await fetch(
        `${process.env.REACT_APP_TIMETABLE_ADMIN_BASE_URL}/line_statistics/level1`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Et-Client-Name': 'entur-ninsar'
          },
        },
      );
      if (response.ok) {
        const lineStatisticsResponse = await response.json();
        let lineStatisticsPerProviderId: LineStatisticsPerProviderId = {};
        for (const providerId in lineStatisticsResponse) {
          const lineStatisticsResponseForProvider: LineStatisticsResponse =
            lineStatisticsResponse[providerId];
          if (
            lineStatisticsResponseForProvider &&
            lineStatisticsResponseForProvider.publicLines.length > 0
          ) {
            const formatted = calculateLineStatistics(
              lineStatisticsResponseForProvider,
            );
            lineStatisticsPerProviderId = {
              ...lineStatisticsPerProviderId,
              [providerId]: formatted,
            };
          }
        }
        setLineStatisticsForAllProviders(lineStatisticsPerProviderId);
        setLineStatisticsForAllProvidersError(undefined);
      } else {
        setLineStatisticsForAllProvidersError({
          status: response.status,
          statusText: response.statusText,
        });
      }
    };
    fetchReport();
  }, [getToken]);

  return { lineStatisticsForAllProviders, lineStatisticsForAllProvidersError };
};
