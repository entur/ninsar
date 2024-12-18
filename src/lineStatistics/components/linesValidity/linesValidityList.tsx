import React, { useEffect, useState } from 'react';
import style from './linesValidity.module.scss';
import {
  LineStatistics,
  LineType,
  PeriodValidity,
  Validity,
} from '../../lineStatistics.types';
import { sortLines } from './linesFilters/sortingUtilities';
import { LinesValidityHeader } from './linesValidityHeader';
import {
  infoText,
  validityCategoryLabel,
} from '../../lineStatistics.constants';
import { useLocale } from '../../../appContext';
import { Timeline } from '../timeline/timeline';
import { ExpandableTimeline } from '../expandableTimeline/expandableTimeline';
import { useRandomId } from '@entur/utils';
import { Heading3 } from '@entur/typography';
import { SortingChips } from './linesFilters/sortingChips';
import { ValidityChips } from './linesFilters/validityChips';
import { BannerAlertBox } from '@entur/alert';
import { ValidNumberOfDaysText } from './validNumberOfDaysText';

interface Props {
  defaultSelectedValidity: Validity;
  lineStatistics: LineStatistics;
  listTitle: string;
  selectedLineType?: LineType;
}

export const LinesValidityList = ({
  defaultSelectedValidity,
  lineStatistics,
  listTitle,
  selectedLineType = LineType.ALL,
}: Props) => {
  const locale = useLocale();
  const randomId = useRandomId('eds-expandable');

  const [expandedLinesState, setExpandedLinesState] = useState<
    Map<string, boolean>
  >(new Map<string, boolean>());

  const [sorting, setSorting] = useState<number>(1);
  const [sortedLineNumbers, setSortedLineNumbers] = useState<string[]>();

  const [selectedValidity, setSelectedValidity] = useState<Validity>(
    defaultSelectedValidity,
  );

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
  }, [defaultSelectedValidity]);

  useEffect(() => {
    lineStatistics &&
      setSortedLineNumbers(
        sortLines(sorting, lineStatistics, selectedValidity),
      );
  }, [lineStatistics, selectedValidity, sorting]);

  const DayTypesValidity = ({ lineNumber }: { lineNumber: string }) => (
    <>
      {lineStatistics.linesMap[lineNumber].lines.map((l, i) => (
        <Timeline key={`Timeline${randomId}${i}`} timetables={l.timetables} />
      ))}
    </>
  );

  return (
    <>
      <Heading3>{listTitle}</Heading3>
      <div className={style.linesValidityListContainer}>
        <ValidityChips
          selectedValidity={selectedValidity}
          setSelectedValidity={setSelectedValidity}
        />
        {!sortedLineNumbers || sortedLineNumbers.length === 0 ? (
          <BannerAlertBox variant="info">
            {selectedValidity === Validity.ALL
              ? infoText(locale).noLinesFoundInfo
              : infoText(locale).foundNot(
                  validityCategoryLabel(locale)[selectedValidity],
                )}
          </BannerAlertBox>
        ) : (
          <>
            {sortedLineNumbers.length > 1 && (
              <SortingChips sorting={sorting} setSorting={setSorting} />
            )}
            {sortedLineNumbers
              .filter(
                (lineNumber) =>
                  selectedLineType === LineType.ALL ||
                  !lineStatistics.linesMap[lineNumber].lineType ||
                  lineStatistics.linesMap[lineNumber].lineType ===
                    selectedLineType,
              )
              .map((lineNumber, index) => (
                <>
                  <ExpandableTimeline
                    id={randomId}
                    open={isLineOpen(lineNumber)}
                    onToggle={() => toggleLineOpen(lineNumber)}
                    effectivePeriodsForLineNumber={
                      lineStatistics.linesMap[lineNumber]
                        .effectivePeriods as PeriodValidity[]
                    }
                    lineNumber={lineNumber}
                    lineNames={lineStatistics.linesMap[
                      lineNumber
                    ].lineNames.join(', ')}
                    key={`LineItem${randomId}${index}`}
                    numberOfDaysHeader={
                      <ValidNumberOfDaysText
                        lineNumber={lineNumber}
                        numberOfDays={
                          lineStatistics.linesMap[lineNumber].daysValid
                        }
                      />
                    }
                    linesValidityListHeader={
                      <LinesValidityHeader
                        key={`LineItemHeader${randomId}`}
                        startDate={lineStatistics.startDate}
                        validFromDate={lineStatistics.requiredValidityDate}
                        endDate={lineStatistics.endDate}
                      />
                    }
                  >
                    <DayTypesValidity
                      lineNumber={lineNumber}
                      key={`DayTypesValidity${randomId}`}
                    />
                  </ExpandableTimeline>
                </>
              ))}
          </>
        )}
      </div>
    </>
  );
};
