import React, { useEffect, useState } from 'react';
import {
  Auth0Provider,
  Auth0ProviderOptions,
  useAuth0,
} from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { App } from './App';
import {useAuth} from "./AppProvider";

const onRedirectCallback =
  (navigate: any) =>
  (appState: any): void => {
    navigate(appState?.returnTo || window.location.pathname);
  };

export interface Props extends Auth0ProviderOptions {}

const AuthedApp = () => {
  const { getAccessTokenSilently, logout } = useAuth0();

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
      <AuthedApp />
    </Auth0Provider>
  );
};
