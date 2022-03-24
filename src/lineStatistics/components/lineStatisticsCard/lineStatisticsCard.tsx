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
import { List, ListItem } from 'material-ui/List';
import { HeaderTimeline, Timeline } from 'bogu';
import { sortLines, sortIcon } from 'bogu/utils';
import {
  FormattedLineStatistics,
  LineStatistics,
} from '../../lineStatistics.types';
import style from './lineStatisticsCard.module.scss';
import { formatLineStats } from 'bogu/utils';
import { Heading3 } from '@entur/typography';
import { MuiThemeProvider } from 'material-ui/styles';

interface Props {
  selectedSegment: string;
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
  const [expandedLinesState, setExpandedLinesState] = useState<
    Map<string, boolean>
  >(new Map<string, boolean>());
  const [formattedLineStatistics, setFormattedLineStatistics] =
    useState<FormattedLineStatistics>();

  useEffect(() => {
    console.log('Inside useEffect');
    const formatted = formatLineStats(lineStatistics);
    console.log('formatted', formatted);
    setFormattedLineStatistics(formatted);
  }, [lineStatistics, setFormattedLineStatistics]);

  const toggleLineOpen = (lineNumber: string) => {
    const expandedLinesStateCopy = new Map<string, boolean>(expandedLinesState);
    expandedLinesStateCopy.set(lineNumber, !isLineOpen(lineNumber));
    setExpandedLinesState(expandedLinesStateCopy);
  };

  const isLineOpen = (lineNumber: string) => {
    return !!expandedLinesState.get(lineNumber);
  };

  const changeSorting = () => {
    const states = 5;
    const sort = (sorting + 1) % states;
    setSorting(sort);
  };

  const order: string[] =
    formattedLineStatistics &&
    sortLines(sorting, formattedLineStatistics, selectedSegment, daysValid);

  return formattedLineStatistics ? (
    <MuiThemeProvider>
      <div className={style.containerCard}>
        <Heading3 className={style.title}>{title}</Heading3>
        <div className={style.headerContainer}>
          <div
            className={style.sortIconStyle}
            onClick={changeSorting}
            title="Sort lines"
          >
            {sortIcon(sorting)}
          </div>
          <div className={style.headerText}>
            {formattedLineStatistics.startDate}
          </div>
          <div className={style.headerText}>
            {formattedLineStatistics.validFromDate} (120 days)
          </div>
          <div className={style.headerText}>
            {formattedLineStatistics.endDate}
          </div>
        </div>
        <div className={style.linesListContainer}>
          <List>
            {order.map((lineNumber, index) => (
              <ListItem
                key={'line' + index}
                disabled
                className={style.listItem}
                style={{ paddingTop: '0', paddingLeft: '0', paddingRight: '0', lineHeight: '0', paddingBottom: '1px' }}
                open={isLineOpen(lineNumber)}
                onNestedListToggle={() => toggleLineOpen(lineNumber)}
                children={
                  <div
                    key={'ht-wrapper' + index}
                    onClick={() => {
                      toggleLineOpen(lineNumber);
                    }}
                  >
                    <HeaderTimeline
                      line={lineNumber}
                      hoverText={formattedLineStatistics.linesMap[
                        lineNumber
                      ].lineNames.join(', ')}
                      index={index}
                      key={'HeaderTimeline' + index}
                      validDaysOffset={formattedLineStatistics.validDaysOffset}
                      validFromDate={formattedLineStatistics.validFromDate}
                      effectivePeriods={
                        formattedLineStatistics.linesMap[lineNumber]
                          .effectivePeriods
                      }
                    />
                  </div>
                }
                nestedItems={[
                  <ListItem
                    disabled
                    key={'line-n' + index}
                    style={{ padding: '0', marginLeft: '0' }}
                    children={formattedLineStatistics.linesMap[
                      lineNumber
                    ].lines.map((l, i) => (
                      <Timeline
                        key={'timelineItem' + index + '-' + i}
                        timetables={l.timetables}
                        isLast={
                          i ===
                          formattedLineStatistics.linesMap[lineNumber].lines
                            .length -
                            1
                        }
                        validDaysOffset={
                          formattedLineStatistics.validDaysOffset
                        }
                        index={i}
                      />
                    ))}
                  />,
                ]}
              />
            ))}
          </List>
        </div>
      </div>
    </MuiThemeProvider>
  ) : (
    <div>Formatting Line Statistics</div>
  );
};
