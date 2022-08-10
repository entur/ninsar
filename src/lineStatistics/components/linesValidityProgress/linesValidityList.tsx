import React, { useEffect, useState } from 'react';
import style from './linesValidityProgress.module.scss';
import { LineStatistics, PeriodValidity, Validity } from '../../lineStatistics.types';
import { sortLines } from './sorting/sortingUtilities';
import { LinesValidityListHeader } from './linesValidityListHeader';
import {
  infoText,
  validityCategoryLabel,
} from '../../lineStatistics.constants';
import { useLocale } from '../../../appContext';
import { Timeline } from "../timeline/timeline";
import { ExpandableTimeline } from "../expandableTimeline/expandableTimeline";
import { useRandomId } from "@entur/utils";
import { Heading4 } from "@entur/typography";
import { SortingChips } from "./sorting/sortingChips";

interface Props {
  selectedValidityCategory: Validity;
  lineStatistics: LineStatistics;
  listTitle: string;
}

export const LinesValidityList = ({
  selectedValidityCategory,
  lineStatistics,
  listTitle
}: Props) => {
  const locale = useLocale();
  const randomId = useRandomId('eds-expandable');

  const [expandedLinesState, setExpandedLinesState] = useState<Map<string, boolean>>(new Map<string, boolean>());

  const [sorting, setSorting] = useState<number>(0);
  const [sortedLineNumbers, setSortedLineNumbers] = useState<string[]>();

  const toggleLineOpen = (lineNumber: string) => {
    const expandedLinesStateCopy = new Map<string, boolean>(expandedLinesState);
    expandedLinesStateCopy.set(lineNumber, !isLineOpen(lineNumber));
    setExpandedLinesState(expandedLinesStateCopy);
  };

  const isLineOpen = (lineNumber: string) => {
    return !!expandedLinesState.get(lineNumber);
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
    <>
      {lineStatistics.linesMap[lineNumber].lines.map((l, i) => (
        <Timeline
          key={'Timeline' + index + lineNumber}
          timetables={l.timetables}
        />
      ))}
    </>
  );

  return (
    <>
      <Heading4>{listTitle}</Heading4>
      <div className={style.linesValidityListContainer}>
        {!sortedLineNumbers || sortedLineNumbers.length === 0 ? (
          <div style={{ marginLeft: '20px' }}>
            {selectedValidityCategory === Validity.ALL
              ? infoText(locale).noLinesFoundInfo
              : `${infoText(locale).foundNot} ${
                validityCategoryLabel()[selectedValidityCategory]
              }`}
          </div>
        ) : (
          <>
            {sortedLineNumbers.length > 1 &&
             <SortingChips id={randomId} sorting={sorting} setSorting={setSorting} />
            }
            {sortedLineNumbers.map((lineNumber, index) => (
              <ExpandableTimeline
                id={randomId}
                open={isLineOpen(lineNumber)}
                onToggle={() => toggleLineOpen(lineNumber)}
                effectivePeriodsForLineNumber={lineStatistics.linesMap[lineNumber].effectivePeriods as PeriodValidity[]}
                lineNumber={lineNumber}
                lineNames={lineStatistics.linesMap[lineNumber].lineNames.join(', ')}
                key={'LineItem' + index + lineNumber}
                linesValidityListHeader={
                  <LinesValidityListHeader
                    startDate={lineStatistics.startDate}
                    validFromDate={lineStatistics.requiredValidityDate}
                    endDate={lineStatistics.endDate}
                  />
                }
              >
                <DayTypesValidity
                  index={index}
                  lineNumber={lineNumber}
                  key={'DayTypesValidity' + lineNumber + index}
                />
              </ExpandableTimeline>
            ))}
          </>
        )}
      </div>
    </>
  );
};
