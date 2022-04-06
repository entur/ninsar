import { useEffect, useState } from 'react';
import { FetchError, LineStatistics } from '../lineStatistics.types';
import { useAuth } from '../../appProvider';
import { calculateLineStatistics } from '../lineStatisticsCalculator/lineStatisticsCalculator';

type LineStatisticsPerProvider = {
  [providerId: string]: LineStatistics;
};

export const useLineStatisticsForAllProviders = () => {
  const { getToken } = useAuth();

  const [lineStatisticsForAllProviders, setLineStatisticsForAllProviders] =
    useState<LineStatisticsPerProvider | undefined>();
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
        let lineStatisticsResponseFormatted: LineStatisticsPerProvider = {};
        for (const providerId in lineStatisticsResponse) {
          const formatted = calculateLineStatistics(
            lineStatisticsResponse[providerId],
          );
          lineStatisticsResponseFormatted = {
            ...lineStatisticsResponseFormatted,
            [providerId]: formatted,
          };
        }
        setLineStatisticsForAllProviders(lineStatisticsResponseFormatted);
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
