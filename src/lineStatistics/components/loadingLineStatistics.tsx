import { FetchError } from '../apiHooks/lineStatistics.response.types';
import { Loader } from '@entur/loader';
import { SmallAlertBox } from '@entur/alert';
import React, { ReactElement } from 'react';

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
}: Props) => (
  <>
    {isLoading ? (
      <Loader style={{ width: '100%' }}>Laster</Loader>
    ) : providerError ||
      (lineStatisticsError && exportedLineStatisticsError) ? (
      <SmallAlertBox variant="error">
        Kunne ikke laste inn dataene. Prøv igjen senere.
      </SmallAlertBox>
    ) : (
      children
    )}
  </>
);
