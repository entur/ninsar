import React from 'react';
import './app.module.scss';
import { LineStatisticsForProvider } from './lineStatistics/lineStatisticsForProvider';
import { AppProvider } from './appProvider';
import { NinsarPayload } from './index';
import { LineStatisticsForAllProviders } from './lineStatistics/lineStatisticsForAllProviders';

export function App(props: NinsarPayload) {
  return (
    <React.StrictMode>
      <AppProvider {...props}>
        <div className="ninsar-app">
          <div className="ninsar-app-content">
            {props.providerId ? (
              <LineStatisticsForProvider providerId={props.providerId} />
            ) : (
              <LineStatisticsForAllProviders />
            )}
          </div>
        </div>
      </AppProvider>
    </React.StrictMode>
  );
}
