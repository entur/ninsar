import { color } from 'bogu/styles';
import React from 'react';
import style from './pieStatistics.module.scss';
import { ExpandableText } from '@entur/expand';
import { NumberOfLinesType } from './pieStatistics.types';
import { titleText } from '../../lineStatistics.constants';
import { useLocale } from '../../../appContext';

export const ExpandableNumberOfLines = ({
  numberOfInvalidLines,
  numberOfValidLines,
  numberOfExpiringLines,
  totalNumberOfLines,
}: NumberOfLinesType) => {
  const locale = useLocale();
  return (
    <div className={style.numberOfLines}>
      <ExpandableText
        title={`${titleText(locale).numberOfLines}: ${totalNumberOfLines}`}
      >
        <div className={style.numberOfLinesPerCategory}>
          <span style={{ color: color.invalid }}>{numberOfInvalidLines}</span> /{' '}
          <span style={{ color: color.valid }}>{numberOfValidLines}</span> /{' '}
          <span style={{ color: color.expiring }}>{numberOfExpiringLines}</span>
        </div>
      </ExpandableText>
    </div>
  );
};
