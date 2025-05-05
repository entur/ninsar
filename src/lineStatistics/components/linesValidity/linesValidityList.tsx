import React, { useEffect, useState } from 'react';
import style from './linesValidity.module.scss';
import { useRandomId } from '@entur/utils';
import { Heading3 } from '@entur/typography';
import { BannerAlertBox } from '@entur/alert';
import {
  LineStatistics,
  PeriodValidity,
  Validity,
} from '../../lineStatistics.types';
import { useLocale } from '../../../appContext';
import { sortLines } from './linesFilters/sortingUtilities';
import { Timeline } from '../timeline/timeline';
import { ValidityChips } from './linesFilters/validityChips';
import {
  infoText,
  validityCategoryLabel,
} from '../../lineStatistics.constants';
import { SortingChips } from './linesFilters/sortingChips';
import { ExpandableTimeline } from '../expandableTimeline/expandableTimeline';
import { ValidNumberOfDaysText } from './validNumberOfDaysText';
import { LinesValidityHeader } from './linesValidityHeader';
import { useLineStatisticsPublicLineDetails } from '../../apiHooks/useLineStatisticsPublicLineDetails';
import { LoadingLineStatistics } from '../loadingLineStatistics';

interface Props {
  providerId: string;
  defaultSelectedValidity: Validity;
  lineStatistics: LineStatistics;
  listTitle: string;
}

export const LinesValidityList = ({
  providerId,
  defaultSelectedValidity,
  lineStatistics,
  listTitle,
}: Props) => {
  const locale = useLocale();
  const randomId = useRandomId('eds-expandable');

  const { fetchPublicLineValidity, mergedLineStatistics, loading, error } =
    useLineStatisticsPublicLineDetails(providerId, lineStatistics);

  const [expandedLinesState, setExpandedLinesState] = useState<
    Map<string, boolean>
  >(new Map<string, boolean>());

  const [sorting, setSorting] = useState<number>(1);
  const [sortedLineNumbers, setSortedLineNumbers] = useState<string[]>();

  const [selectedValidity, setSelectedValidity] = useState<Validity>(
    defaultSelectedValidity,
  );

  const toggleLineOpen = (lineNumber: string) => {
    fetchPublicLineValidity(lineNumber);
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
    mergedLineStatistics &&
      setSortedLineNumbers(
        sortLines(sorting, mergedLineStatistics, selectedValidity),
      );
  }, [mergedLineStatistics, selectedValidity, sorting]);

  const DayTypesValidity = ({ lineNumber }: { lineNumber: string }) => (
    <>
      {mergedLineStatistics.linesMap[lineNumber].lines.map((l, i) => (
        <Timeline
          key={`Timeline${l.timetables.map((t) => t.objectId).join('-')}`}
          timetables={l.timetables}
        />
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
            {sortedLineNumbers.map((lineNumber) => (
              <ExpandableTimeline
                id={randomId}
                open={isLineOpen(lineNumber)}
                onToggle={() => toggleLineOpen(lineNumber)}
                effectivePeriodsForLineNumber={
                  mergedLineStatistics.linesMap[lineNumber]
                    .effectivePeriods as PeriodValidity[]
                }
                lineNumber={lineNumber}
                lineNames={mergedLineStatistics.linesMap[
                  lineNumber
                ].lineNames.join(', ')}
                key={`LineItem${lineNumber}`}
                numberOfDaysHeader={
                  <ValidNumberOfDaysText
                    lineNumber={lineNumber}
                    numberOfDays={
                      mergedLineStatistics.linesMap[lineNumber].daysValid
                    }
                  />
                }
                linesValidityListHeader={
                  <LinesValidityHeader
                    key={`LineItemHeader${lineNumber}`}
                    startDate={mergedLineStatistics.startDate}
                    validFromDate={mergedLineStatistics.requiredValidityDate}
                    endDate={mergedLineStatistics.endDate}
                  />
                }
              >
                <LoadingLineStatistics
                  isLoading={loading}
                  lineStatisticsError={error}
                >
                  <DayTypesValidity
                    lineNumber={lineNumber}
                    key={`DayTypesValidity${randomId}`}
                  />
                </LoadingLineStatistics>
              </ExpandableTimeline>
            ))}
          </>
        )}
      </div>
    </>
  );
};
