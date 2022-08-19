import React, { ReactElement } from 'react';
import { FetchError } from '../apiHooks/lineStatistics.response.types';
import { errorText } from '../lineStatistics.constants';
import { LoadingOrFailed } from './LoadingOrFailed';
import { useLocale } from '../../appContext';

interface Props {
  providerError?: FetchError | undefined;
  lineStatisticsError?: FetchError | undefined;
  exportedLineStatisticsError: FetchError | undefined;
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
