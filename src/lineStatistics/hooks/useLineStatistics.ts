import { useEffect, useState } from 'react';
import { FetchError, LineStatistics } from '../lineStatistics.types';
import { useAuth } from '../../appProvider';

export const useLineStatistics = (providerId: string | undefined) => {
  const { getToken } = useAuth();

  const [lineStatistics, setLineStatistics] = useState<
    LineStatistics | undefined
  >();
  const [lineStatisticsError, setLineStatisticsError] = useState<FetchError | undefined>();

  useEffect(() => {
    const fetchReport = async () => {
      const accessToken = getToken ? await getToken() : '';
      const response = await fetch(
        `${process.env.REACT_APP_TIMETABLE_ADMIN_BASE_URL}/${providerId}/line_statistics`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      if (response.ok) {
        const lineStatistics = await response.json();
        setLineStatistics(lineStatistics);
        setLineStatisticsError(undefined);
      } else {
        setLineStatisticsError({
          status: response.status,
          statusText: response.statusText,
        });
      }
    };
    fetchReport();
  }, [getToken, providerId]);

  return { lineStatistics, lineStatisticsError };
};
