import React, { useContext } from 'react';
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

export const useAppConfig = (): {
  showNumberOfLinesCard?: boolean;
  showDeliveryDateCard?: boolean;
  showExpiringDaysCard?: boolean;
} => {
  const context = useContext(AppContext);
  return {
    showDeliveryDateCard: context?.showDeliveryDateCard ?? false,
    showExpiringDaysCard: context?.showExpiringDaysCard ?? false,
    showNumberOfLinesCard: context?.showNumberOfLinesCard ?? false,
  };
};
