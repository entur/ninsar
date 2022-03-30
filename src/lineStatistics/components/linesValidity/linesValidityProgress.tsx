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

import React, { useState } from 'react';
import { sortLines } from 'bogu/utils';
import { LineStatistics } from '../../lineStatistics.types';
import style from './linesValidity.module.scss';
import { Heading3 } from '@entur/typography';
import { MuiThemeProvider } from 'material-ui/styles';
import { LinesValidityListHeader } from './linesValidityListHeader';
import { LinesValidityList } from './linesValidityList';

interface Props {
  selectedSegment: string;
  setSelectedSegment: (selectedSegment: string) => void;
  daysValid: number;
  lineStatistics: LineStatistics;
  providerName: string;
}

export const LinesValidityProgress = ({
  lineStatistics,
  providerName,
  selectedSegment,
  daysValid,
}: Props) => {
  const [sorting, setSorting] = useState<number>(1);

  const changeSorting = () => {
    const states = 5;
    const sort = (sorting + 1) % states;
    setSorting(sort);
  };

  const sortedLineNumbers: string[] =
    lineStatistics &&
    sortLines(sorting, lineStatistics, selectedSegment, daysValid);

  return lineStatistics ? (
    <MuiThemeProvider>
      <div className={style.linesValidity}>
        <Heading3 className={style.title}>
          {providerName} - {selectedSegment}
        </Heading3>
        <LinesValidityListHeader
          startDate={lineStatistics.startDate}
          validFromDate={lineStatistics.validFromDate}
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
