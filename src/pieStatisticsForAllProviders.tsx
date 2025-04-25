import React from 'react';
import style from './lineStatistics/lineStatistics.module.scss';
import { LineStatisticsPerProviderId } from './lineStatistics/apiHooks/lineStatistics.response.types';
import { Provider, Validity } from './lineStatistics/lineStatistics.types';
import { PieStatistics } from './lineStatistics/components/pieStatistics/pieStatistics';
import { getNumberOfLinesType } from './lineStatistics/components/numberOfLines/numberOfLines.util';

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
          .map((providerId, index) => (
            <PieStatistics
              showHeader={true}
              key={'provider-pie' + index}
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
