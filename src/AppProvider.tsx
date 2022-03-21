import React, { FC, ReactNode, useContext } from 'react';
import { DefaultPayload } from '@entur/micro-frontend';

export const AppContext = React.createContext<DefaultPayload | undefined>(
  undefined,
);

export const useAuth = () => {
  let context = useContext(AppContext);

  return {
    getToken: context?.getToken,
  };
};

interface AppProviderProps extends DefaultPayload {
  children: ReactNode;
}

export const AppProvider: FC<AppProviderProps> = ({ children, ...rest }) => {
  return (
    <AppContext.Provider value={{ ...rest }}>{children}</AppContext.Provider>
  );
};
