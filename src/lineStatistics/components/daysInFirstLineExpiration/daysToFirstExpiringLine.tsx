import { Card } from '../card/card';
import style from './daysToFirstExpiringLine.module.scss';
import { Heading1, Heading4 } from '@entur/typography';
import { titleText } from '../../lineStatistics.constants';
import { LineStatistics } from '../../lineStatistics.types';
import { useEffect, useState } from 'react';
import { color } from 'bogu/styles';
import { useLocale } from '../../../appContext';

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
      <Heading4>{titleText(locale).daysToFirstExpiringLine}</Heading4>
      <Heading1 className={style.days} style={{ color: color.expiring }}>
        {numberOfDays}
      </Heading1>
    </Card>
  );
};
