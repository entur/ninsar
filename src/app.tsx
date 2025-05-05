import React from 'react';
import './app.module.scss';
import { AppProvider } from './appProvider';
import { NinsarPayload } from './index';
import { LineStatisticsForAllProviders } from './lineStatistics/lineStatisticsForAllProviders';
import { LineStatisticsForProvider } from './lineStatistics/lineStatisticsForProvider';
import { Validity } from './lineStatistics/lineStatistics.types';

export function App(props: NinsarPayload) {
  const [selectedProviderId, setSelectedProviderId] = React.useState<
    string | undefined
  >(props.providerId);
  const [selectedValidity, setSelectedValidity] = React.useState<Validity>(
    Validity.ALL,
  );

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
                selectedValidity={selectedValidity}
                setSelectedValidity={setSelectedValidity}
              />
            ) : (
              <LineStatisticsForAllProviders
                setSelectedProvider={(providerId) =>
                  setSelectedProviderId(providerId)
                }
                setSelectedValidity={setSelectedValidity}
              />
            )}
          </div>
        </div>
      </AppProvider>
    </React.StrictMode>
  );
}
