import { useEffect, useState } from 'react';
import { Provider } from '../lineStatistics.types';
import { useAuth } from '../../appContext';
import { FetchError, ProviderResponse } from './lineStatistics.response.types';

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
        const provider: ProviderResponse = await response.json();
        setProvider({
          id: provider.id,
          name: provider.name,
          code: provider.chouetteInfo.referential,
        });
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
