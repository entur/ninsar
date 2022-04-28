import { useEffect, useState } from 'react';
import { LineStatistics } from '../lineStatistics.types';
import { useAuth } from '../../appContext';
import { calculateLineStatistics } from '../lineStatisticsCalculator/lineStatisticsCalculator';
import { FetchError } from './lineStatistics.response.types';

export const useLineStatisticsForProvider = (
  providerId: string | undefined,
) => {
  const { getToken } = useAuth();

  const [lineStatistics, setLineStatistics] = useState<
    LineStatistics | undefined
  >();
  const [lineStatisticsError, setLineStatisticsError] = useState<
    FetchError | undefined
  >();

  useEffect(() => {
    const fetchLineStatisticsForProvider = async () => {
      const accessToken = getToken ? await getToken() : '';
      const response = await fetch(
        `${process.env.REACT_APP_TIMETABLE_ADMIN_BASE_URL}/${providerId}/line_statistics`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      if (response.ok) {
        const lineStatisticsResponse = await response.json();
        setLineStatistics(calculateLineStatistics(lineStatisticsResponse));
        setLineStatisticsError(undefined);
      } else {
        setLineStatisticsError({
          status: response.status,
          statusText: response.statusText,
        });
      }
    };
    fetchLineStatisticsForProvider();
  }, [getToken, providerId]);

  return { lineStatistics, lineStatisticsError };
};
