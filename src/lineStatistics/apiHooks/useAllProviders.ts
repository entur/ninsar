import { useEffect, useState } from 'react';
import { FetchError, LineStatistics, Provider } from '../lineStatistics.types';
import { useAuth } from '../../appProvider';

interface ProviderWithChouetteInfo extends Provider {
  chouetteInfo: {
    migrateDataToProvider: number;
  };
}

export const useAllProviders = () => {
  const { getToken } = useAuth();

  const [allProviders, setAllProviders] = useState<Provider[] | undefined>();
  const [allProvidersError, setAllProvidersError] = useState<
    FetchError | undefined
  >();

  useEffect(() => {
    const fetchAllProvider = async () => {
      const accessToken = getToken ? await getToken() : '';
      const response = await fetch(
        `${process.env.REACT_APP_PROVIDERS_BASE_URL}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      if (response.ok) {
        const providersWithChouetteInfo: ProviderWithChouetteInfo[] =
          await response.json();
        setAllProviders(
          providersWithChouetteInfo
            .filter((provider) => !!provider.chouetteInfo.migrateDataToProvider)
            .map((provider) => ({ id: provider.id, name: provider.name })),
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
