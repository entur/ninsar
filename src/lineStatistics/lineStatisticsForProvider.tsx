import { useLineStatisticsForProvider } from './apiHooks/useLineStatisticsForProvider';
import style from './lineStatistics.module.scss';
import { Card } from './components/card/card';
import { LinesValidity } from './components/linesValidity/linesValidity';
import React from 'react';
import { Validity } from './lineStatistics.types';
import { LoadingLineStatistics } from './components/loadingLineStatistics';

type Props = {
  providerId: string;
};
export const LineStatisticsForProvider = ({ providerId}: Props) => {
  const {
    lineStatistics,
    loading,
    error
  } = useLineStatisticsForProvider(providerId);

  return (
      <LoadingLineStatistics
        isLoading={loading}
        lineStatisticsError={error}
      >
        <>
      {!loading && !error && (
      <div className={style.linesStatisticsContainer}>
        <Card
          title={lineStatistics?.providerName}
          className={style.lineStatisticsCard}
        >
          <LinesValidity
            providerId={providerId}
            defaultSelectedValidity={Validity.ALL}
            lineStatistics={lineStatistics}
          />
        </Card>
      </div>
    )}
        </>
    </LoadingLineStatistics>
  );
}
