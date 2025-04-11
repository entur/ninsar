import React from 'react';
import './app.module.scss';
import { LineStatisticsForProvider } from './kilili/LineStatisticsForProvider/LineStatisticsForProvider';
import { AppProvider } from './appProvider';
import { NinsarPayload } from './index';
import { LineStatisticsForAllProviders } from './kilili/LineStatisticsForAllProviders/LineStatisticsForAllProviders';

export function App(props: NinsarPayload) {
  const [selectedProviderId, setSelectedProviderId] = React.useState<number | undefined>(Number(props.providerId));
  console.log({selectedProviderId});
  return (
    <React.StrictMode>
      <AppProvider {...props}>
        <div className="ninsar-app">
          <div className="ninsar-app-content">
            {selectedProviderId ? (
              <LineStatisticsForProvider providerId={selectedProviderId!} />
            ) : (
              <LineStatisticsForAllProviders handleShowAll={(providerId) => setSelectedProviderId(providerId)} />
            )}
          </div>
        </div>
      </AppProvider>
    </React.StrictMode>
  );
}
