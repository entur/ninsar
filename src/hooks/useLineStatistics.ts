import { useEffect, useState } from 'react';
import { useAuth } from '../AppProvider';
import { ValidationReport } from '../model/ValidationReport';
import { useAuth0 } from '@auth0/auth0-react';

export type ValidationReportFetchError = {
  status: number;
  statusText: string;
};

export interface Props {
  providerId: string;
}

export const useLineStatistics = (providerId: string | undefined) => {
  const { getToken } = useAuth();
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  //  const [report, setReport] = useState<ValidationReport | undefined>();
  //  const [error, setError] = useState<ValidationReportFetchError | undefined>();

  useEffect(() => {
    console.log('inside useEffect');
    const fetchReport = async () => {
      const accessToken = getToken ? await getToken() : '';

      console.log('accessToken', accessToken);

      const response = await fetch(
        `${process.env.REACT_APP_TIMETABLE_ADMIN_BASE_URL}/${providerId}/line_statistics`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      if (response.ok) {
        const lineStatistics = await response.json();
        console.log('lineStatistics', lineStatistics);
        //        setReport(report);
        //        setError(undefined);
      } else {
        console.log('error', response);
        /*        setError({
                                                  status: response.status,
                                                  statusText: response.statusText,
                                                });
                                        */
      }
    };
    fetchReport();
  }, [getToken, providerId]);

  return {};
};
