import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AppProvider } from './AppProvider';
import './App.css';
import { DefaultPayload } from '@entur/micro-frontend';
import {StatisticsForProvider} from "./pages/statisticsForProvider";

interface AppProps extends DefaultPayload {}

export function App(props: AppProps) {

  console.log('props.getToken', props.getToken());

  return (
    <React.StrictMode>
      <AppProvider {...props}>
        <BrowserRouter
          basename={
            process.env.REACT_APP_STANDALONE ? '' : 'netex-validation-reports'
          }
        >
          <div className="ninsar-app">
            <div className="ninsar-app-content">
              <Switch>
                <Route path="/line-statistics/:providerCode" component={StatisticsForProvider} />
              </Switch>
            </div>
          </div>
        </BrowserRouter>
      </AppProvider>
    </React.StrictMode>
  );
}
