import React from 'react';
import {
  Auth0Provider,
  Auth0ProviderOptions,
  useAuth0,
  withAuthenticationRequired,
} from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { App } from './app';

const onRedirectCallback =
  (navigate: any) =>
  (appState: any): void => {
    navigate(appState?.returnTo || window.location.pathname);
  };

export interface Props extends Auth0ProviderOptions {}

const ProtectedApp = () => {
  const Cp = withAuthenticationRequired(WrappedApp);
  return <Cp />;
};

const WrappedApp = () => {
  const { getAccessTokenSilently } = useAuth0();
  return <App getToken={getAccessTokenSilently} />;
};

export const AppStandalone = (props: Props) => {
  const navigate = useNavigate();
  return (
    <Auth0Provider
      {...props}
      cacheLocation="localstorage"
      useRefreshTokens
      onRedirectCallback={onRedirectCallback((v: string) => navigate(v))}
    >
      <ProtectedApp />
    </Auth0Provider>
  );
};
