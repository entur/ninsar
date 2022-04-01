import style from './linesValidity.module.scss';
import React from 'react';
import { sortIcon } from '../../sortIcons';

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
  return (
    <div className={style.headerContainer}>
      <div
        className={style.sortIconStyle}
        onClick={changeSorting}
        title="Sort lines"
      >
        {sortIcon(sorting)}
      </div>
      <div className={style.headerText}>{startDate}</div>
      <div className={style.headerText}>{validFromDate} (120 days)</div>
      <div className={style.headerText}>{endDate}</div>
    </div>
  );
};
