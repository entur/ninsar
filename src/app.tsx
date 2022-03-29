import React from 'react';
import './app.module.scss';
import { ProtectedLineStatisticsForProvider } from './lineStatistics/lineStatisticsForProvider';
import { ProtectedLineStatisticsForAllProviders } from './lineStatistics/lineStatisticsForAllProviders';
import { AppProvider } from './appProvider';
import { NinsarPayload } from './index';

export function App(props: NinsarPayload) {
  console.log('props', props);

  return (
    <React.StrictMode>
      <AppProvider {...props}>
        <div className="ninsar-app">
          <div className="ninsar-app-content">
              Disse er contents
            {props.providerId ? (
              <ProtectedLineStatisticsForProvider
                providerId={props.providerId}
              />
            ) : (
              <ProtectedLineStatisticsForAllProviders />
            )}
          </div>
        </div>
      </AppProvider>
    </React.StrictMode>
  );
}
