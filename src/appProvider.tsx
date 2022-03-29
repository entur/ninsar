import React, { FC, ReactNode, useContext } from 'react';
import { NinsarPayload } from './index';

export const AppContext = React.createContext<NinsarPayload | undefined>(
  undefined,
);

export const useAuth = () => {
  let context = useContext(AppContext);

  return {
    getToken: context?.getToken,
  };
};

interface AppProviderProps extends NinsarPayload {
  children: ReactNode;
}

export const AppProvider: FC<AppProviderProps> = ({ children, ...rest }) => {
  return (
    <AppContext.Provider value={{ ...rest }}>{children}</AppContext.Provider>
  );
};
