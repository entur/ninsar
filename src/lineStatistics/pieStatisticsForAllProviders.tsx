import React from 'react';
import { PieChart } from './components/pieChart/pieChart';
import style from './lineStatistics.module.scss';
import { Provider, Validity } from './lineStatistics.types';
import { LineStatisticsPerProviderId } from './apiHooks/lineStatistics.response.types';

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
    <div className={style.linesStatisticsForAllProviders}>
      {(lineStatistics || exportedLineStatistics) &&
        providers
          .filter(
            (provider) =>
              (lineStatistics &&
                Object.keys(lineStatistics).some(
                  (key) => key == String(provider.id),
                )) ||
              (exportedLineStatistics &&
                Object.keys(exportedLineStatistics).some(
                  (key) => key == String(provider.id),
                )),
          )
          .map((provider, index) => (
            <PieChart
              showHeader={true}
              key={'provider-pie' + index}
              providerName={provider.name}
              handleShowAllClick={() => handleShowAll(provider)}
              handlePieOnClick={(label: Validity) =>
                handlePieOnClick(label, provider)
              }
              lineStatistics={lineStatistics && lineStatistics[provider.id]}
              exportedLineStatistics={
                exportedLineStatistics && exportedLineStatistics[provider.id]
              }
              maintainAspectRatio={true}
            />
          ))}
    </div>
  );
};
