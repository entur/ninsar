import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './app';
import { registerMicroFrontend, DefaultPayload } from '@entur/micro-frontend';
import { BrowserRouter } from 'react-router-dom';
import { AppStandalone } from './appStandalone';

registerMicroFrontend<DefaultPayload>({
  microFrontendId: 'ror-ninsar',
  mount: (mountPoint, payload) => {
    ReactDOM.render(
      <BrowserRouter basename="netex-validation-reports">
        <App {...payload} />
      </BrowserRouter>,
      mountPoint,
    );
  },
  unmount: (mountPoint) => {
    ReactDOM.unmountComponentAtNode(mountPoint);
  },
});

if (process.env.REACT_APP_STANDALONE) {
  ReactDOM.render(
    <BrowserRouter>
      <AppStandalone
        domain={process.env.REACT_APP_AUTH0_DOMAIN || ''}
        clientId={process.env.REACT_APP_AUTH0_CLIENT_ID || ''}
        audience={process.env.REACT_APP_AUTH0_AUDIENCE || ''}
        redirectUri={`${window.location.origin}${process.env.REACT_APP_AUTH0_RELATIVE_CALLBACK_URL}`}
      />
    </BrowserRouter>,
    document.getElementById('root'),
  );
}