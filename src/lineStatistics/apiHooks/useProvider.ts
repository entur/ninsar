import { useEffect, useState } from 'react';
import {FetchError, LineStatistics, Provider} from '../lineStatistics.types';
import { useAuth } from '../../appProvider';

export const useProvider = (providerId: string | undefined) => {
  const { getToken } = useAuth();

  const [provider, setProvider] = useState<Provider | undefined>();
  const [providerError, setProviderError] = useState<FetchError | undefined>();

  useEffect(() => {
    const fetchProvider = async () => {
      const accessToken = getToken ? await getToken() : '';
      const response = await fetch(
        `${process.env.REACT_APP_PROVIDERS_BASE_URL}/${providerId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      if (response.ok) {
        const provider = await response.json();
        setProvider(provider);
        setProviderError(undefined);
      } else {
        setProviderError({
          status: response.status,
          statusText: response.statusText,
        });
      }
    };
    fetchProvider();
  }, [getToken, providerId]);

  return { provider, providerError };
};
