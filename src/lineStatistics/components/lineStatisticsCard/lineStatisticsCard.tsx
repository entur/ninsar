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
import { sortLines } from 'bogu/utils';
import {
  FormattedLineStatistics,
  LineStatistics,
} from '../../lineStatistics.types';
import style from './lineStatisticsCard.module.scss';
import { formatLineStats } from 'bogu/utils';
import { Heading3 } from '@entur/typography';
import { MuiThemeProvider } from 'material-ui/styles';
import { LinesListHeader } from './linesListHeader';
import { LinesList } from './linesList';

interface Props {
  selectedSegment: string;
  setSelectedSegment: (selectedSegment: string) => void;
  daysValid: number;
  lineStatistics: LineStatistics;
  title: string;
}

export const LineStatisticsCard = ({
  lineStatistics,
  title,
  selectedSegment,
  daysValid,
}: Props) => {
  const [sorting, setSorting] = useState<number>(1);
  const [formattedLineStatistics, setFormattedLineStatistics] =
    useState<FormattedLineStatistics>();

  useEffect(() => {
    const formatted = formatLineStats(lineStatistics);
    setFormattedLineStatistics(formatted);
  }, [lineStatistics, setFormattedLineStatistics]);

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
      <div className={style.containerCard}>
        <Heading3 className={style.title}>{title}</Heading3>
        <LinesListHeader
          startDate={formattedLineStatistics.startDate}
          validFromDate={formattedLineStatistics.validFromDate}
          endDate={formattedLineStatistics.endDate}
          sorting={sorting}
          changeSorting={changeSorting}
        />
        <LinesList
          sortedLineNumbers={sortedLineNumbers}
          formattedLineStatistics={formattedLineStatistics}
        />
      </div>
    </MuiThemeProvider>
  ) : (
    <div>Formatting Line Statistics</div>
  );
};
