import React, { ReactElement } from 'react';
import { FetchError } from '../apiHooks/lineStatistics.response.types';
import { useLocale } from '../../appProvider';
import { errorText } from '../lineStatistics.constants';
import { LoadingOrFailed } from './LoadingOrFailed';

interface Props {
  providerError?: FetchError;
  lineStatisticsError?: FetchError;
  exportedLineStatisticsError?: FetchError;
  children: ReactElement | ReactElement[];
  isLoading: boolean;
}

export const LoadingLineStatistics = ({
  isLoading,
  providerError,
  lineStatisticsError,
  exportedLineStatisticsError,
  children,
}: Props) => {
  const locale = useLocale();
  return (
    <LoadingOrFailed
      errorText={errorText(locale).failedToLoadData}
      isLoading={isLoading}
      error={
        !!(
          providerError ||
          (lineStatisticsError && exportedLineStatisticsError)
        )
      }
    >
      {children}
    </LoadingOrFailed>
  );
};
