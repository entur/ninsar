import { useEffect, useState } from 'react';
import { Provider } from '../lineStatistics.types';
import { useAuth } from '../../appContext';
import { FetchError, ProviderResponse } from './lineStatistics.response.types';

export const useAllProviders = () => {
  const { getToken } = useAuth();

  const [allProviders, setAllProviders] = useState<Provider[]>();
  const [allProvidersError, setAllProvidersError] = useState<
    FetchError | undefined
  >();

  useEffect(() => {
    const fetchAllProvider = async () => {
      const accessToken = getToken ? await getToken() : '';
      const response = await fetch(
        `${process.env.REACT_APP_PROVIDERS_BASE_URL}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Et-Client-Name': 'entur-ninsar'
          },
        },
      );
      if (response.ok) {
        const providersWithChouetteInfo: ProviderResponse[] =
          await response.json();
        setAllProviders(
          providersWithChouetteInfo
            .filter((provider) => !!provider.chouetteInfo.migrateDataToProvider)
            .map((provider) => ({
              id: provider.id,
              name: provider.name,
              code: provider.chouetteInfo.referential,
            })),
        );
        setAllProvidersError(undefined);
      } else {
        setAllProvidersError({
          status: response.status,
          statusText: response.statusText,
        });
      }
    };
    fetchAllProvider();
  }, [getToken]);

  return { allProviders, allProvidersError };
};
