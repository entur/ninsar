import style from './lineStatisticsCard.module.scss';
import { List, ListItem } from 'material-ui/List';
import { HeaderTimeline, Timeline } from 'bogu';
import React, { useState } from 'react';
import { FormattedLineStatistics } from '../../lineStatistics.types';

interface Props {
  sortedLineNumbers: string[];
  formattedLineStatistics: FormattedLineStatistics;
}

export const LinesList = ({
  sortedLineNumbers,
  formattedLineStatistics,
}: Props) => {
  const [expandedLinesState, setExpandedLinesState] = useState<
    Map<string, boolean>
  >(new Map<string, boolean>());
  const toggleLineOpen = (lineNumber: string) => {
    const expandedLinesStateCopy = new Map<string, boolean>(expandedLinesState);
    expandedLinesStateCopy.set(lineNumber, !isLineOpen(lineNumber));
    setExpandedLinesState(expandedLinesStateCopy);
  };

  const isLineOpen = (lineNumber: string) => {
    return !!expandedLinesState.get(lineNumber);
  };

  const DayTypesValidity = ({
    index,
    lineNumber,
  }: {
    index: number;
    lineNumber: string;
  }) => (
    <ListItem
      disabled
      key={'line-n' + index}
      style={{ padding: '0', marginLeft: '0' }}
    >
      {formattedLineStatistics.linesMap[lineNumber].lines.map((l, i) => (
        <Timeline
          key={'timelineItem' + index + '-' + i}
          timetables={l.timetables}
          isLast={
            i === formattedLineStatistics.linesMap[lineNumber].lines.length - 1
          }
          validDaysOffset={formattedLineStatistics.validDaysOffset}
          index={i}
        />
      ))}
    </ListItem>
  );

  const LineValidity = ({
    index,
    lineNumber,
  }: {
    index: number;
    lineNumber: string;
  }) => (
    <div
      key={'ht-wrapper' + index}
      onClick={() => {
        toggleLineOpen(lineNumber);
      }}
    >
      <HeaderTimeline
        line={lineNumber}
        hoverText={formattedLineStatistics.linesMap[lineNumber].lineNames.join(
          ', ',
        )}
        index={index}
        key={'HeaderTimeline' + index}
        validDaysOffset={formattedLineStatistics.validDaysOffset}
        validFromDate={formattedLineStatistics.validFromDate}
        effectivePeriods={
          formattedLineStatistics.linesMap[lineNumber].effectivePeriods
        }
      />
    </div>
  );

  return (
    <div className={style.linesListContainer}>
      <List>
        {sortedLineNumbers.map((lineNumber, index) => (
          <ListItem
            key={'line' + index}
            disabled
            className={style.listItem}
            style={{
              paddingTop: '0',
              paddingLeft: '0',
              paddingRight: '0',
              lineHeight: '0',
              paddingBottom: '1px',
            }}
            open={isLineOpen(lineNumber)}
            onNestedListToggle={() => toggleLineOpen(lineNumber)}
            nestedItems={[
              <DayTypesValidity index={index} lineNumber={lineNumber} />,
            ]}
          >
            <LineValidity index={index} lineNumber={lineNumber} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};
