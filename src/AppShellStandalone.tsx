import React, {useEffect, useState} from 'react';
import {
  Auth0Provider,
  Auth0ProviderOptions,
  useAuth0,
} from '@auth0/auth0-react';
import { useHistory } from 'react-router-dom';
import { App } from './App';

const onRedirectCallback =
  (navigate: any) =>
  (appState: any): void => {
    navigate(appState?.returnTo || window.location.pathname);
  };

export interface Props extends Auth0ProviderOptions {}

const AuthedApp = () => {
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect, isLoading } = useAuth0()

  useEffect(() => {
    async function checkUser() {
      console.log("checkUser", isAuthenticated);
      if (isAuthenticated) {
      } else {
        await loginWithRedirect();
      }
    }

    checkUser();
    })

  return <App getToken={getAccessTokenSilently} />;
};

export const AppShellStandalone = (props: Props) => {
  const history = useHistory();
  return (
    <Auth0Provider
      {...props}
      cacheLocation="localstorage"
      useRefreshTokens
      onRedirectCallback={onRedirectCallback((v: string) => history.push(v))}
    >
      <AuthedApp />
    </Auth0Provider>
  );
};
