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

import React, { useEffect, useState } from 'react';
import { LineStatistics, Validity } from '../../lineStatistics.types';
import style from './linesValidityProgress.module.scss';
import { Heading3 } from '@entur/typography';
import { MuiThemeProvider } from 'material-ui/styles';
import { LinesValidityListHeader } from './linesValidityListHeader';
import { LinesValidityList } from './linesValidityList';
import { IconButton } from '@entur/button';
import { Tooltip } from '@entur/tooltip';
import { CloseIcon } from '@entur/icons';
import { sortLines } from './sorting/sortingUtilities';

interface Props {
  selectedValidityCategory: Validity;
  lineStatistics: LineStatistics;
  providerName: string;
  handleClose?: () => void;
}

export const LinesValidityProgress = ({
  lineStatistics,
  providerName,
  selectedValidityCategory,
  handleClose,
}: Props) => {
  const [sorting, setSorting] = useState<number>(1);
  const [sortedLineNumbers, setSortedLineNumbers] = useState<string[]>();

  useEffect(() => {
    lineStatistics &&
      setSortedLineNumbers(
        sortLines(sorting, lineStatistics, selectedValidityCategory),
      );
  }, [lineStatistics, selectedValidityCategory, sorting]);

  const changeSorting = () => {
    const states = 5;
    const sort = (sorting + 1) % states;
    setSorting(sort);
  };

  const labelForValidityCategory = {
    [Validity.INVALID]: 'Invalid lines',
    [Validity.VALID]: 'Valid lines',
    [Validity.EXPIRING]: 'Expiring lines',
    [Validity.ALL]: 'all',
  };

  return sortedLineNumbers ? (
    <MuiThemeProvider>
      <div className={style.linesValidity}>
        <div className={style.linesValidityTitleHeader}>
          <Heading3 className={style.title}>
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

        <LinesValidityListHeader
          startDate={lineStatistics.startDate}
          validFromDate={lineStatistics.requiredValidityDate}
          endDate={lineStatistics.endDate}
          sorting={sorting}
          changeSorting={changeSorting}
        />
        <LinesValidityList
          sortedLineNumbers={sortedLineNumbers}
          lineStatistics={lineStatistics}
        />
      </div>
    </MuiThemeProvider>
  ) : (
    <div>Formatting Line Statistics</div>
  );
};
