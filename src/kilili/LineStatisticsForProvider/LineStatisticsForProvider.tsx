import { useLineStatisticsForProvider } from './useLineStatisticsForProvider';
import style from '../../lineStatistics/lineStatistics.module.scss';
import { Card } from '../../lineStatistics/components/card/card';
import { LinesValidity } from '../linesValidity/linesValidity';
import React from 'react';
import { Validity } from '../../lineStatistics/lineStatistics.types';

type Props = {
  providerId: number;
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
          title={"Eivind"}
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
