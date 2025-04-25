import { useEffect, useState } from 'react';
import { useAuth } from '../../appContext';
import {
  FetchError,
  LatestDeliveryDateResponse,
} from './lineStatistics.response.types';
import moment from 'moment';

export const useLatestDeliveryDate = (providerId: string | undefined) => {
  const { getToken } = useAuth();

  const [latestDeliveryDate, setLatestDeliveryDate] = useState<
    string | undefined
  >();
  const [latestDeliveryDateError, setLatestDeliveryDateError] = useState<
    FetchError | undefined
  >();

  useEffect(() => {
    const fetchLatestDeliveryDate = async () => {
      const accessToken = getToken ? await getToken() : '';
      const response = await fetch(
        `${process.env.REACT_APP_EVENT_BASE_URL}/latest_upload/${providerId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Et-Client-Name': 'entur-ninsar',
          },
        },
      );
      if (response.ok) {
        const latestDeliveryDateResponse: LatestDeliveryDateResponse =
          await response.json();
        setLatestDeliveryDate(
          latestDeliveryDateResponse.date
            ? moment(latestDeliveryDateResponse.date).format('YYYY-MM-DD')
            : 'N/A',
        );
        setLatestDeliveryDateError(undefined);
      } else {
        setLatestDeliveryDateError({
          status: response.status,
          statusText: response.statusText,
        });
      }
    };
    fetchLatestDeliveryDate();
  }, [getToken, providerId]);

  return { latestDeliveryDate, latestDeliveryDateError };
};
