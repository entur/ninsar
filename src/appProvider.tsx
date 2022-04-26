import React, { FC, ReactNode, useContext } from 'react';
import { NinsarPayload } from './index';
import { Locale } from './lineStatistics/lineStatistics.types';

export const AppContext = React.createContext<NinsarPayload | undefined>(
  undefined,
);

export const useAuth = () => {
  const context = useContext(AppContext);

  return {
    getToken: context?.getToken,
  };
};

export const useLocale = () => {
  const context = useContext(AppContext);
  return context?.locale ?? Locale.EN;
};

interface AppProviderProps extends NinsarPayload {
  children: ReactNode;
}

export const AppProvider: FC<AppProviderProps> = ({ children, ...rest }) => {
  return (
    <AppContext.Provider value={{ ...rest }}>{children}</AppContext.Provider>
  );
};
