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
        <div>
          <span style={{ color: 'var(--invalid-color)' }}>{numberOfInvalidLines}</span> /{' '}
          <span style={{ color: 'var(--valid-color)' }}>{numberOfValidLines}</span> /{' '}
          <span style={{ color: 'var(--expiring-color)' }}>{numberOfExpiringLines}</span>
        </div>
      </ExpandableText>
    </div>
  );
};
