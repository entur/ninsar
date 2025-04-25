import React from 'react';
import { FetchError } from '../../apiHooks/lineStatistics.response.types';
import style from './incompleteLineStatisticsError.module.scss';
import { SmallAlertBox } from '@entur/alert';
import { errorText } from '../../lineStatistics.constants';
import { useLocale } from '../../../appContext';

interface Props {
  lineStatisticsError?: FetchError | null;
}

export const IncompleteLineStatisticsError = ({
  lineStatisticsError,
}: Props) => {
  const locale = useLocale();
  return (
    <>
      {lineStatisticsError && (
        <div className={style.lineStatisticsErrorContainer}>
          <SmallAlertBox variant="error">
            {errorText(locale).missingLineStatisticsFromOperatorPortal}
          </SmallAlertBox>
        </div>
      )}
    </>
  );
};
