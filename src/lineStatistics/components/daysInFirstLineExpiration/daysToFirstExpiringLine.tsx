import { Card } from '../card/card';
import style from './daysToFirstExpiringLine.module.scss';
import { Heading1, Heading4 } from '@entur/typography';
import { titleText } from '../../lineStatistics.constants';
import { LineStatistics } from '../../lineStatistics.types';
import { useEffect, useState } from 'react';
import { useLocale } from '../../../appContext';

interface Props {
  lineStatistics?: LineStatistics | undefined;
  exportedLineStatistics?: LineStatistics | undefined;
}

export const DaysToFirstExpiringLine = ({
  lineStatistics,
  exportedLineStatistics,
}: Props) => {
  const locale = useLocale();

  const [numberOfDays, setNumberOfDays] = useState<number>(0);

  useEffect(() => {
    const minLineStatistics = lineStatistics
      ? Math.min(
          ...Object.values(lineStatistics.linesMap).map(
            (lineStats) => lineStats.daysValid,
          ),
        )
      : 0;

    const minExportedLineStatistics = exportedLineStatistics
      ? Math.min(
          ...Object.values(exportedLineStatistics.linesMap).map(
            (lineStats) => lineStats.daysValid,
          ),
        )
      : 0;
    setNumberOfDays(Math.min(minLineStatistics, minExportedLineStatistics));
  }, [lineStatistics, exportedLineStatistics]);

  return (
    <Card className={style.daysInFirstLineExpiration}>
      <Heading4>{titleText(locale).daysToFirstExpiringLine}</Heading4>
      <Heading1
        className={style.days}
        style={{ color: 'var(--expiring-color)' }}
      >
        {numberOfDays}
      </Heading1>
    </Card>
  );
};
