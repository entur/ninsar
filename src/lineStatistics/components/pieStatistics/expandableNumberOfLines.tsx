import React from 'react';
import style from './pieStatistics.module.scss';
import { ExpandableText } from '@entur/expand';
import { NumberOfLinesType } from './pieStatistics.types';
import { titleText } from '../../lineStatistics.constants';
import { useLocale } from '../../../appContext';

export const ExpandableNumberOfLines = ({
  numberOfExpiredLines,
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
          <span style={{ color: 'var(--expired-color)' }}>{numberOfExpiredLines}</span> /{' '}
          <span style={{ color: 'var(--valid-color)' }}>{numberOfValidLines}</span> /{' '}
          <span style={{ color: 'var(--expiring-color)' }}>{numberOfExpiringLines}</span>
        </div>
      </ExpandableText>
    </div>
  );
};
