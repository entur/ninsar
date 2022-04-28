import { Heading1, Heading4, Heading2 } from '@entur/typography';
import { Card } from '../card/card';
import { titleText } from '../../lineStatistics.constants';
import style from './numberOfLines.module.scss';
import { NumberOfLinesType } from '../pieStatistics/pieStatistics.types';
import { color } from 'bogu/styles';
import { useLocale } from '../../../appContext';

interface Props {
  numberOfLines: NumberOfLinesType;
}

export const NumberOfLines = ({ numberOfLines }: Props) => {
  const locale = useLocale();
  return (
    <Card className={style.numberOfLines}>
      <div className={style.totalNumberOfLinesContainer}>
        <Heading4>{titleText(locale).numberOfLines}</Heading4>
        <Heading1 className={style.totalNumberOfLines}>
          {numberOfLines.totalNumberOfLines}
        </Heading1>
      </div>
      <div className={style.numberOfLinesPerCategory}>
        <Heading2
          className={style.numberOfLinesForCategory}
          style={{ color: color.valid }}
        >
          {numberOfLines.numberOfValidLines}
        </Heading2>
        <Heading2
          className={style.numberOfLinesForCategory}
          style={{ color: color.expiring }}
        >
          {numberOfLines.numberOfExpiringLines}
        </Heading2>
        <Heading2
          className={style.numberOfLinesForCategory}
          style={{ color: color.invalid }}
        >
          {numberOfLines.numberOfInvalidLines}
        </Heading2>
      </div>
    </Card>
  );
};
