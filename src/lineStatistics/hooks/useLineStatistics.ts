import { useEffect, useState } from 'react';
import { LineStatistics } from '../lineStatistics.types';
import { useAuth } from '../../appProvider';

export type LineStatisticsFetchError = {
  status: number;
  statusText: string;
};

export const useLineStatistics = (providerId: string | undefined) => {
  const { getToken } = useAuth();

  const [lineStatistics, setLineStatistics] = useState<
    LineStatistics | undefined
  >();
  const [error, setError] = useState<LineStatisticsFetchError | undefined>();

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
        setError(undefined);
      } else {
        setError({
          status: response.status,
          statusText: response.statusText,
        });
      }
    };
    fetchReport();
  }, [getToken, providerId]);

  return { lineStatistics, error };
};
