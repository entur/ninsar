import style from './linesValidity.module.scss';
import React from 'react';
import { titleText } from '../../lineStatistics.constants';
import { useLocale } from '../../../appContext';
import { SmallText} from '@entur/typography';

interface Props {
  startDate: string;
  validFromDate: string;
  endDate: string;
}

export const LinesValidityListHeader = ({
  startDate,
  validFromDate,
  endDate,
}: Props) => {
  const locale = useLocale();
  return (
    <div className={style.headerContainer}>
      <SmallText margin="none" as="div">
        {startDate}
      </SmallText>
      <div>{''}</div>
      <SmallText margin="none" as="div">
        {`${validFromDate} (120 ${titleText(locale).days})`}
      </SmallText>
      <SmallText margin="none" as="div">
        {endDate}
      </SmallText>
    </div>
  );
};
