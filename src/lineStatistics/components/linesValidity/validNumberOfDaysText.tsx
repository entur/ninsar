import React from 'react';
import { SmallText } from '@entur/typography';
import { titleText } from '../../lineStatistics.constants';
import { useLocale } from '../../../appContext';

interface Props {
  lineNumber: string;
  numberOfDays: number;
}

export const ValidNumberOfDaysText = ({ lineNumber, numberOfDays }: Props) => {
  const locale = useLocale();
  return (
    <>
      {numberOfDays === 0 && (
        <SmallText>{titleText(locale).noLongerValid(lineNumber)}</SmallText>
      )}

      {numberOfDays > 0 && numberOfDays < 120 && (
        <SmallText>
          {titleText(locale).expiringLine(lineNumber, numberOfDays)}
        </SmallText>
      )}

      {numberOfDays >= 120 && (
        <SmallText>
          {titleText(locale).validLine(lineNumber, numberOfDays)}
        </SmallText>
      )}
    </>
  );
};
