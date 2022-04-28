import React, { FC, ReactNode } from 'react';
import { AppContext } from './appContext';
import { NinsarPayload } from './index';

interface Props extends NinsarPayload {
  children: ReactNode;
}

export const AppProvider: FC<Props> = ({ children, ...rest }) => {
  return (
    <AppContext.Provider value={{ ...rest }}>{children}</AppContext.Provider>
  );
};
