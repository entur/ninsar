import { useEffect, useState } from 'react';
import { useAuth } from '../../appProvider';
import { calculateLineStatistics } from '../lineStatisticsCalculator/lineStatisticsCalculator';
import {
  FetchError,
  LineStatisticsPerProviderId,
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
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      if (response.ok) {
        const lineStatisticsResponse = await response.json();
        let lineStatisticsPerProviderId: LineStatisticsPerProviderId = {};
        for (const providerId in lineStatisticsResponse) {
          let lineStatisticsResponseForProvider =
            lineStatisticsResponse[providerId];
          if (lineStatisticsResponseForProvider) {
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
