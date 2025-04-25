import React from 'react';
import style from './lineStatistics.module.scss';
import { LineStatisticsPerProviderId } from './apiHooks/lineStatistics.response.types';
import { Validity } from './lineStatistics.types';
import { PieStatistics } from './components/pieStatistics/pieStatistics';

interface Props {
  lineStatistics: LineStatisticsPerProviderId | undefined;
  handleShowAll: (providerId: string) => void;
  handlePieOnClick: (validity: Validity, providerId: string) => void;
}

export const PieStatisticsForAllProviders = ({
  lineStatistics,
  handleShowAll,
  handlePieOnClick,
}: Props) => {
  return (
    <div className={style.pieStatisticsForAllProviders}>
      {(lineStatistics) &&
        Object.keys(lineStatistics)
          .map((providerId) => (
            <PieStatistics
              showHeader={true}
              key={'provider-pie' + providerId}
              providerName={lineStatistics[providerId].providerName!}
              handleShowAllClick={() => handleShowAll(providerId)}
              handlePieOnClick={(label: Validity) =>
                handlePieOnClick(label, providerId)
              }
              className={style.pieChartContainer}
              numberOfLines={{
                numberOfExpiredLines: lineStatistics[providerId].validityCategoriesCount?.get(Validity.INVALID)!,
                numberOfValidLines: lineStatistics[providerId].validityCategoriesCount?.get(Validity.VALID)!,
                numberOfExpiringLines: lineStatistics[providerId].validityCategoriesCount?.get(Validity.EXPIRING)!,
                totalNumberOfLines: lineStatistics[providerId].validityCategoriesCount?.get(Validity.ALL)!,
              }}
              showLineButton={true}
            />
          ))}
    </div>
  );
};
