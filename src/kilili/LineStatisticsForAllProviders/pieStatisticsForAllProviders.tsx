import React from 'react';
import style from '../../lineStatistics/lineStatistics.module.scss';
import { LineStatisticsPerProviderId } from '../../lineStatistics/apiHooks/lineStatistics.response.types';
import { Provider, Validity } from '../../lineStatistics/lineStatistics.types';
import { PieStatistics } from '../../lineStatistics/components/pieStatistics/pieStatistics';
import { getNumberOfLinesType } from '../../lineStatistics/components/numberOfLines/numberOfLines.util';

interface Props {
  lineStatistics: LineStatisticsPerProviderId | undefined;
  providers: Provider[];
  handleShowAll: (provider: Provider) => void;
  handlePieOnClick: (validity: Validity, provider: Provider) => void;
}

export const PieStatisticsForAllProviders = ({
  lineStatistics,
  providers,
  handleShowAll,
  handlePieOnClick,
}: Props) => {
console.log('lineStatistics', lineStatistics);


  return (
    <div className={style.pieStatisticsForAllProviders}>
      {(lineStatistics) &&
        providers
          .filter(
            (provider) =>
              (lineStatistics &&
                Object.keys(lineStatistics).some(
                  (key) => key === String(provider.id),
                ))
          )
          .map((provider, index) => (
            <PieStatistics
              showHeader={true}
              key={'provider-pie' + index}
              providerName={provider.name}
              handleShowAllClick={() => handleShowAll(provider)}
              handlePieOnClick={(label: Validity) =>
                handlePieOnClick(label, provider)
              }
              className={style.pieChartContainer}
              numberOfLines={{
                numberOfExpiredLines: lineStatistics[provider.id].validityCategoriesCount?.get(Validity.INVALID)!,
                numberOfValidLines: lineStatistics[provider.id].validityCategoriesCount?.get(Validity.VALID)!,
                numberOfExpiringLines: lineStatistics[provider.id].validityCategoriesCount?.get(Validity.EXPIRING)!,
                totalNumberOfLines: lineStatistics[provider.id].validityCategoriesCount?.get(Validity.ALL)!,
              }}
              showLineButton={true}
            />
          ))}
    </div>
  );
};
