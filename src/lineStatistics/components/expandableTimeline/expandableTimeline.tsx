import React, { CSSProperties } from 'react';
import { Heading5, SubParagraph } from '@entur/typography';
import style from './expandableTimeline.module.scss';
import { BaseExpand, ExpandArrow } from "@entur/expand";
import { PeriodValidity } from "../../lineStatistics.types";

interface Props {
  lineNumber: string;
  lineNames: string;
  effectivePeriodsForLineNumber: PeriodValidity[];
  children: React.ReactNode;
  id: string;
  open: boolean;
  onToggle: () => void;
  contentStyle?: CSSProperties | undefined;
  linesValidityListHeader: React.ReactNode;
}

export const ExpandableTimeline = ({
  effectivePeriodsForLineNumber,
  lineNumber,
  lineNames,
  children,
  id,
  open,
  onToggle,
  contentStyle,
  linesValidityListHeader
}: Props) => {

  const getTimelineStyle = (index: number, effectivePeriod: PeriodValidity) => ({
    width: `${effectivePeriod.timelineEndPosition - effectivePeriod.timelineStartPosition}%`,
    marginLeft: `${
      index === 0
        ? effectivePeriod.timelineStartPosition
        : effectivePeriod.timelineStartPosition - effectivePeriodsForLineNumber[index - 1].timelineEndPosition
    }%`
  });

  const effectivePeriodText = (effectivePeriod: PeriodValidity) =>
    effectivePeriod.timelineStartPosition > 0 && effectivePeriod.from.localeCompare(effectivePeriod.to) !== 0
      ? effectivePeriod.from + ' - ' + effectivePeriod.to
      : effectivePeriod.to;

  return (
    <div className={style.edsExpandablePanel}>
      <Heading5 margin="none" as="div" className={style.headerLineNumberContainer}>
        {lineNumber} - {!!effectivePeriodsForLineNumber.length ? lineNames : 'Ugyldig linje. Mangler data'}
      </Heading5>
      {linesValidityListHeader}
      <button
        type="button"
        className={style.edsExpandablePanel__trigger}
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
      >
        <div className={style.edsExpandablePanel_titleContainer}>
          <div className={style.timeLineContainer}>
            <div className={style.verticalLine} />
            {
              effectivePeriodsForLineNumber.map((effectivePeriod, index) => (
                <SubParagraph
                  margin="none"
                  as="div"
                  title={effectivePeriodText(effectivePeriod)}
                  style={getTimelineStyle(index, effectivePeriod)}
                  className={style.validPeriodTitleContainer}
                >
                  {effectivePeriodText(effectivePeriod)}
                </SubParagraph>
              ))
            }
          </div>
          <div className={style.edsExpandablePanel__iconContainer}>
            <ExpandArrow open={open} />
          </div>
        </div>
      </button>
      <BaseExpand
        className={style.edsExpandablePanel__content}
        id={id}
        open={open}
        style={contentStyle}
      >
        {children}
      </BaseExpand>
    </div>
  )
};