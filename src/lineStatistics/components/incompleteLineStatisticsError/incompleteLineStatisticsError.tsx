import React from 'react';
import { FetchError } from '../../apiHooks/lineStatistics.response.types';
import style from './incompleteLineStatisticsError.module.scss';
import { SmallAlertBox } from '@entur/alert';
import { errorText } from '../../lineStatistics.constants';
import { useLocale } from '../../../appContext';

interface Props {
  lineStatisticsError?: FetchError;
  exportedLineStatisticsError?: FetchError;
}

export const IncompleteLineStatisticsError = ({
  lineStatisticsError,
  exportedLineStatisticsError,
}: Props) => {
  const locale = useLocale();
  return (
    <>
      {lineStatisticsError ||
        (exportedLineStatisticsError && (
          <div className={style.lineStatisticsErrorContainer}>
            {(lineStatisticsError && !exportedLineStatisticsError && (
              <SmallAlertBox variant="error">
                {errorText(locale).missingLineStatisticsFromOperatorPortal}
              </SmallAlertBox>
            )) ||
              (!lineStatisticsError && exportedLineStatisticsError && (
                <SmallAlertBox variant="error">
                  {errorText(locale).missingLineStatisticsFromNplan}
                </SmallAlertBox>
              ))}
          </div>
        ))}
    </>
  );
};
