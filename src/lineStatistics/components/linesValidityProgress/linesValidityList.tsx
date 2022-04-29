import React, { useEffect, useState } from 'react';
import style from './linesValidityProgress.module.scss';
import { List, ListItem } from 'material-ui/List';
import { HeaderTimeline, Timeline } from 'bogu';
import { LineStatistics, Validity } from '../../lineStatistics.types';
import { sortLines } from './sorting/sortingUtilities';
import { LinesValidityListHeader } from './linesValidityListHeader';
import {
  infoText,
  validityCategoryLabel,
} from '../../lineStatistics.constants';
import { useLocale } from '../../../appContext';

interface Props {
  selectedValidityCategory: Validity;
  lineStatistics: LineStatistics;
}

export const LinesValidityList = ({
  selectedValidityCategory,
  lineStatistics,
}: Props) => {
  const locale = useLocale();
  const [expandedLinesState, setExpandedLinesState] = useState<
    Map<string, boolean>
  >(new Map<string, boolean>());

  const [sortedLineNumbers, setSortedLineNumbers] = useState<string[]>();

  const toggleLineOpen = (lineNumber: string) => {
    const expandedLinesStateCopy = new Map<string, boolean>(expandedLinesState);
    expandedLinesStateCopy.set(lineNumber, !isLineOpen(lineNumber));
    setExpandedLinesState(expandedLinesStateCopy);
  };

  const isLineOpen = (lineNumber: string) => {
    return !!expandedLinesState.get(lineNumber);
  };

  const [sorting, setSorting] = useState<number>(1);

  const changeSorting = () => {
    const states = 5;
    const sort = (sorting + 1) % states;
    setSorting(sort);
  };

  useEffect(() => {
    lineStatistics &&
      setSortedLineNumbers(
        sortLines(sorting, lineStatistics, selectedValidityCategory),
      );
  }, [lineStatistics, selectedValidityCategory, sorting]);

  const DayTypesValidity = ({
    index,
    lineNumber,
  }: {
    index: number;
    lineNumber: string;
  }) => (
    <ListItem disabled style={{ padding: '0', marginLeft: '0' }}>
      {lineStatistics.linesMap[lineNumber].lines.map((l, i) => (
        <Timeline
          key={'Timeline' + index + lineNumber}
          timetables={l.timetables}
          isLast={i === lineStatistics.linesMap[lineNumber].lines.length - 1}
          validDaysOffset={33}
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
    <div onClick={() => toggleLineOpen(lineNumber)}>
      <HeaderTimeline
        line={lineNumber}
        hoverText={lineStatistics.linesMap[lineNumber].lineNames.join(', ')}
        index={index}
        validDaysOffset={33}
        validFromDate={lineStatistics.requiredValidityDate}
        effectivePeriods={lineStatistics.linesMap[lineNumber].effectivePeriods}
      />
    </div>
  );

  return (
    <div className={style.linesValidityListContainer}>
      <LinesValidityListHeader
        startDate={lineStatistics.startDate}
        validFromDate={lineStatistics.requiredValidityDate}
        endDate={lineStatistics.endDate}
        sorting={sorting}
        changeSorting={changeSorting}
      />
      {!sortedLineNumbers || sortedLineNumbers.length === 0 ? (
        <div style={{ marginLeft: '20px' }}>
          {selectedValidityCategory === Validity.ALL
            ? infoText(locale).noLinesFoundInfo
            : `${infoText(locale).foundNot} ${
                validityCategoryLabel()[selectedValidityCategory]
              }`}
        </div>
      ) : (
        <List>
          {sortedLineNumbers.map((lineNumber, index) => (
            <ListItem
              key={'LineItem' + index + lineNumber}
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
                <DayTypesValidity
                  index={index}
                  lineNumber={lineNumber}
                  key={'DayTypesValidity' + lineNumber + index}
                />,
              ]}
            >
              <LineValidity index={index} lineNumber={lineNumber} />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};
