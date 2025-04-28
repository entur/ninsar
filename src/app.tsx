import React from 'react';
import './app.module.scss';
import { AppProvider } from './appProvider';
import { NinsarPayload } from './index';
import { LineStatisticsForAllProviders } from './lineStatistics/lineStatisticsForAllProviders';
import { LineStatisticsForProvider } from './lineStatistics/lineStatisticsForProvider';

export function App(props: NinsarPayload) {
  const [selectedProviderId, setSelectedProviderId] = React.useState<
    string | undefined
  >(props.providerId);
  return (
    <React.StrictMode>
      <AppProvider {...props}>
        <div className="ninsar-app">
          <div className="ninsar-app-content">
            {selectedProviderId ? (
              <LineStatisticsForProvider
                providerId={selectedProviderId!}
                setSelectedProvider={(providerId) =>
                  setSelectedProviderId(providerId)
                }
                externalProviderId={!!props.providerId}
              />
            ) : (
              <LineStatisticsForAllProviders
                setSelectedProvider={(providerId) =>
                  setSelectedProviderId(providerId)
                }
              />
            )}
          </div>
        </div>
      </AppProvider>
    </React.StrictMode>
  );
}
