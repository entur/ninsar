import React from 'react';
import { PieStatistics } from './components/pieStatistics/pieStatistics';
import style from './lineStatistics.module.scss';
import { Provider, Validity } from './lineStatistics.types';
import { LineStatisticsPerProviderId } from './apiHooks/lineStatistics.response.types';
import { getNumberOfLinesType } from './components/numberOfLines/numberOfLines.util';

interface Props {
  lineStatistics?: LineStatisticsPerProviderId;
  exportedLineStatistics?: LineStatisticsPerProviderId;
  providers: Provider[];
  handleShowAll: (provider: Provider) => void;
  handlePieOnClick: (validity: Validity, provider: Provider) => void;
}

export const PieStatisticsForAllProviders = ({
  lineStatistics,
  exportedLineStatistics,
  providers,
  handleShowAll,
  handlePieOnClick,
}: Props) => {
  return (
    <div className={style.pieStatisticsForAllProviders}>
      {(lineStatistics || exportedLineStatistics) &&
        providers
          .filter(
            (provider) =>
              (lineStatistics &&
                Object.keys(lineStatistics).some(
                  (key) => key === String(provider.id),
                )) ||
              (exportedLineStatistics &&
                Object.keys(exportedLineStatistics).some(
                  (key) => key === String(provider.id),
                )),
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
              numberOfLines={getNumberOfLinesType(
                lineStatistics && lineStatistics[provider.id],
                exportedLineStatistics && exportedLineStatistics[provider.id],
              )}
              pieWidth={150}
              pieHeight={250}
              className={style.pieChartContainer}
            />
          ))}
    </div>
  );
};
