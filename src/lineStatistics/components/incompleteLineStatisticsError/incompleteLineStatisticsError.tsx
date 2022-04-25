import { FetchError } from '../../apiHooks/lineStatistics.response.types';
import style from './incompleteLineStatisticsError.module.scss';
import { SmallAlertBox } from '@entur/alert';
import React from 'react';

interface Props {
  lineStatisticsError?: FetchError;
  exportedLineStatisticsError?: FetchError;
}

export const IncompleteLineStatisticsError = ({
  lineStatisticsError,
  exportedLineStatisticsError,
}: Props) => (
  <>
    {lineStatisticsError ||
      (exportedLineStatisticsError && (
        <div className={style.lineStatisticsErrorContainer}>
          {(lineStatisticsError && !exportedLineStatisticsError && (
            <SmallAlertBox variant="error">
              Kunne ikke laste inn linjestatistikk for Operatørpotalen. Viser
              kun linjestatistikk for Nplan.
            </SmallAlertBox>
          )) ||
            (!lineStatisticsError && exportedLineStatisticsError && (
              <SmallAlertBox variant="error">
                Kunne ikke laste inn linjestatistikk for Nplan. Viser kun
                linjestatistikk for Operatørpotalen.
              </SmallAlertBox>
            ))}
        </div>
      ))}
  </>
);
