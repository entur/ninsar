import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppProvider } from './AppProvider';
import './App.css';
import { DefaultPayload } from '@entur/micro-frontend';
import { LineStatisticsForProvider } from './pages/lineStatisticsForProvider';
import { LineStatistics } from './pages/lineStatistics';
import { ProtectedComponent } from './pages/ProtectedComponent';
import { Fallback } from './pages/fallback';

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
                element={<ProtectedComponent component={LineStatistics} />}
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
