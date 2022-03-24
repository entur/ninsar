import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './app.module.scss';
import { DefaultPayload } from '@entur/micro-frontend';
import { LineStatisticsForProvider } from './lineStatistics/lineStatisticsForProvider';
import { LineStatisticsForAllProviders } from './lineStatistics/lineStatisticsForAllProviders';
import { ProtectedComponent } from './pages/ProtectedComponent';
import { Fallback } from './pages/fallback';
import { AppProvider } from './appProvider';

interface AppProps extends DefaultPayload {}

export function App(props: AppProps) {
  return (
    <React.StrictMode>
      <AppProvider {...props}>
        <div className="ninsar-app">
          <div className="ninsar-app-content">
            <Routes>
              <Route
                path="line-statistics"
                element={
                  <ProtectedComponent
                    component={LineStatisticsForAllProviders}
                  />
                }
              />
              <Route
                path="line-statistics/:providerId"
                element={
                  <ProtectedComponent component={LineStatisticsForProvider} />
                }
              />
              {process.env.REACT_APP_STANDALONE && (
                <Route
                  path="*"
                  element={<ProtectedComponent component={Fallback} />}
                />
              )}
            </Routes>
          </div>
        </div>
      </AppProvider>
    </React.StrictMode>
  );
}
