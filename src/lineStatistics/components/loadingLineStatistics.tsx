import { FetchError } from '../apiHooks/lineStatistics.response.types';
import { Loader } from '@entur/loader';
import { SmallAlertBox } from '@entur/alert';
import React, { ReactElement } from 'react';
import { useLocale } from '../../appProvider';
import { errorText } from '../lineStatistics.constants';

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
    <>
      {isLoading ? (
        <Loader style={{ width: '100%' }}>Laster</Loader>
      ) : providerError ||
        (lineStatisticsError && exportedLineStatisticsError) ? (
        <SmallAlertBox variant="error">
          {errorText(locale).failedToLoadData}
        </SmallAlertBox>
      ) : (
        children
      )}
    </>
  );
};
