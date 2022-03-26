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
import { FormattedLineStatistics } from '../../lineStatistics.types';
import style from './linesValidity.module.scss';
import { Heading3 } from '@entur/typography';
import { MuiThemeProvider } from 'material-ui/styles';
import { LinesValidityListHeader } from './linesValidityListHeader';
import { LinesValidityList } from './linesValidityList';

interface Props {
  selectedSegment: string;
  setSelectedSegment: (selectedSegment: string) => void;
  daysValid: number;
  formattedLineStatistics: FormattedLineStatistics;
  providerName: string;
}

export const LinesValidity = ({
  formattedLineStatistics,
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
    formattedLineStatistics &&
    sortLines(sorting, formattedLineStatistics, selectedSegment, daysValid);

  return formattedLineStatistics ? (
    <MuiThemeProvider>
      <div className={style.linesValidity}>
        <Heading3 className={style.title}>{providerName} - {selectedSegment}</Heading3>
        <LinesValidityListHeader
          startDate={formattedLineStatistics.startDate}
          validFromDate={formattedLineStatistics.validFromDate}
          endDate={formattedLineStatistics.endDate}
          sorting={sorting}
          changeSorting={changeSorting}
        />
        <LinesValidityList
          sortedLineNumbers={sortedLineNumbers}
          formattedLineStatistics={formattedLineStatistics}
        />
      </div>
    </MuiThemeProvider>
  ) : (
    <div>Formatting Line Statistics</div>
  );
};
