import { Loader } from '@entur/loader';
import { SmallAlertBox } from '@entur/alert';
import React, { ReactElement } from 'react';

interface Props {
  error: boolean;
  errorText: string;
  children: ReactElement | ReactElement[];
  isLoading: boolean;
}

export const LoadingOrFailed = ({
  isLoading,
  error,
  errorText,
  children,
}: Props) => (
  <>
    {isLoading ? (
      <Loader style={{ width: '100%' }}>Laster</Loader>
    ) : error ? (
      <SmallAlertBox variant="error">{errorText}</SmallAlertBox>
    ) : (
      children
    )}
  </>
);
