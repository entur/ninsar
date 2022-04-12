/*
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 */

import React from 'react';
import { LineStatistics, Validity } from '../../lineStatistics.types';
import style from './linesValidityProgress.module.scss';
import { Heading3, Heading4 } from '@entur/typography';
import { MuiThemeProvider } from 'material-ui/styles';
import { LinesValidityList } from './linesValidityList';
import { IconButton } from '@entur/button';
import { Tooltip } from '@entur/tooltip';
import { CloseIcon } from '@entur/icons';

interface Props {
  selectedValidityCategory: Validity;
  lineStatistics?: LineStatistics;
  exportedLineStatistics?: LineStatistics;
  providerName: string;
  handleClose?: () => void;
}

export const LinesValidityProgress = ({
  lineStatistics,
  exportedLineStatistics,
  providerName,
  selectedValidityCategory,
  handleClose,
}: Props) => {
  const labelForValidityCategory = {
    [Validity.INVALID]: 'Invalid lines',
    [Validity.VALID]: 'Valid lines',
    [Validity.EXPIRING]: 'Expiring lines',
    [Validity.ALL]: 'all',
  };

  return (
    <MuiThemeProvider>
      <div className={style.linesValidity}>
        <div className={style.linesValidityTitleHeader}>
          <Heading3 className={style.providerTitle}>
            {providerName} -{' '}
            {labelForValidityCategory[selectedValidityCategory]}
          </Heading3>
          {handleClose && (
            <Tooltip placement="bottom" content="Lukk">
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>

        <div className={style.linesListContainer}>
          {exportedLineStatistics && (
            <>
              <Heading4 className={style.statisticsTitle}>
                Line Statistics from NPlan
              </Heading4>
              <LinesValidityList
                lineStatistics={exportedLineStatistics}
                selectedValidityCategory={selectedValidityCategory}
              />
            </>
          )}

          {lineStatistics && (
            <>
              <Heading4 className={style.statisticsTitle}>
                Line Statistics from Chouette
              </Heading4>
              <LinesValidityList
                lineStatistics={lineStatistics}
                selectedValidityCategory={selectedValidityCategory}
              />
            </>
          )}
        </div>
      </div>
    </MuiThemeProvider>
  );
};
