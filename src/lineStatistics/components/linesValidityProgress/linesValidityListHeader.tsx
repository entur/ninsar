import style from './linesValidityProgress.module.scss';
import React from 'react';
import { sortIcon } from './sorting/sortIcons';
import { titleText } from '../../lineStatistics.constants';
import { useLocale } from '../../../appContext';

interface Props {
  startDate: string;
  validFromDate: string;
  endDate: string;
  sorting: number;
  changeSorting: () => void;
}

export const LinesValidityListHeader = ({
  startDate,
  validFromDate,
  endDate,
  sorting,
  changeSorting,
}: Props) => {
  const locale = useLocale();
  return (
    <div className={style.headerContainer}>
      <div
        className={style.sortIconStyle}
        onClick={changeSorting}
        title={titleText(locale).sortLines}
      >
        {sortIcon(sorting)}
      </div>
      <div className={style.headerText}>{startDate}</div>
      <div className={style.headerText}>{validFromDate} (120 dager)</div>
      <div className={style.headerText}>{endDate}</div>
    </div>
  );
};
