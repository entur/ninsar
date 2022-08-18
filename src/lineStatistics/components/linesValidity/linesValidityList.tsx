import React, { useEffect, useState } from 'react';
import style from './linesValidity.module.scss';
import { LineStatistics, PeriodValidity, Validity } from '../../lineStatistics.types';
import { sortLines } from './linesFilters/sortingUtilities';
import { LinesValidityListHeader } from './linesValidityListHeader';
import {
  infoText,
  validityCategoryLabel,
} from '../../lineStatistics.constants';
import { useLocale } from '../../../appContext';
import { Timeline } from "../timeline/timeline";
import { ExpandableTimeline } from "../expandableTimeline/expandableTimeline";
import { useRandomId } from "@entur/utils";
import { Heading3 } from "@entur/typography";
import { SortingChips } from "./linesFilters/sortingChips";
import { ValidityChips } from "./linesFilters/validityChips";
import { BannerAlertBox } from "@entur/alert";

interface Props {
  defaultSelectedValidity: Validity;
  lineStatistics: LineStatistics;
  listTitle: string;
}

export const LinesValidityList = ({
  defaultSelectedValidity,
  lineStatistics,
  listTitle
}: Props) => {
  const locale = useLocale();
  const randomId = useRandomId('eds-expandable');

  const [expandedLinesState, setExpandedLinesState] = useState<Map<string, boolean>>(new Map<string, boolean>());

  const [sorting, setSorting] = useState<number>(0);
  const [sortedLineNumbers, setSortedLineNumbers] = useState<string[]>();

  const [selectedValidity, setSelectedValidity] = useState<Validity>(defaultSelectedValidity);

  const toggleLineOpen = (lineNumber: string) => {
    const expandedLinesStateCopy = new Map<string, boolean>(expandedLinesState);
    expandedLinesStateCopy.set(lineNumber, !isLineOpen(lineNumber));
    setExpandedLinesState(expandedLinesStateCopy);
  };

  const isLineOpen = (lineNumber: string) => {
    return !!expandedLinesState.get(lineNumber);
  };

  useEffect(() => {
    setSelectedValidity(defaultSelectedValidity);
  }, [defaultSelectedValidity])

  useEffect(() => {
    lineStatistics &&
    setSortedLineNumbers(
      sortLines(sorting, lineStatistics, selectedValidity),
    );
  }, [lineStatistics, selectedValidity, sorting]);

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
      <Heading3>{listTitle}</Heading3>
      <div className={style.linesValidityListContainer}>
        <ValidityChips selectedValidity={selectedValidity} setSelectedValidity={setSelectedValidity} />
        {!sortedLineNumbers || sortedLineNumbers.length === 0 ? (
          <BannerAlertBox variant="info">
            {selectedValidity === Validity.ALL
              ? infoText(locale).noLinesFoundInfo
              : infoText(locale).foundNot(validityCategoryLabel(locale)[selectedValidity])}
          </BannerAlertBox>
        ) : (
          <>
            {sortedLineNumbers.length > 1 &&
             <SortingChips sorting={sorting} setSorting={setSorting} />
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
