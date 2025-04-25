import { useLineStatisticsForProvider } from './lineStatistics/apiHooks/useLineStatisticsForProvider';
import style from './lineStatistics/lineStatistics.module.scss';
import { Card } from './lineStatistics/components/card/card';
import { LinesValidity } from './lineStatistics/components/linesValidity/linesValidity';
import React from 'react';
import { Validity } from './lineStatistics/lineStatistics.types';

type Props = {
  providerId: string;
};
export const LineStatisticsForProvider = ({ providerId}: Props) => {
  const {
    lineStatistics,
    loading,
    error
  } = useLineStatisticsForProvider(providerId);

  console.log({error})
  console.log({lineStatistics});
  return (
    <>
      {(!loading && !error && (
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
    ))}
    </>
  );
}
