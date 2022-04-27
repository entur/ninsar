import { useLocale } from '../../../appProvider';
import { Card } from '../card/card';
import style from './daysToFirstExpiringLine.module.scss';
import { Heading3, Heading5 } from '@entur/typography';
import { titleText } from '../../lineStatistics.constants';
import { LineStatistics } from '../../lineStatistics.types';
import { useEffect, useState } from 'react';

interface Props {
  lineStatistics: LineStatistics;
}

export const DaysToFirstExpiringLine = ({ lineStatistics }: Props) => {
  const locale = useLocale();

  const [numberOfDays, setNumberOfDays] = useState<number>(0);

  useEffect(() => {
    setNumberOfDays(
      Math.min(
        ...Object.values(lineStatistics.linesMap).map(
          (lineStats) => lineStats.daysValid,
        ),
      ),
    );
  }, [lineStatistics]);

  return (
    <Card className={style.daysInFirstLineExpiration}>
      <Heading5>{titleText(locale).daysToFirstExpiringLine}</Heading5>
      <Heading3>{numberOfDays}</Heading3>
    </Card>
  );
};
