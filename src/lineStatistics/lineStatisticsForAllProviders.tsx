import React, { useState } from 'react';
import { useAllProviders } from './apiHooks/useAllProviders';
import { useLineStatisticsForAllProviders } from './apiHooks/useLineStatisticsForAllProviders';
import { Provider, Validity } from './lineStatistics.types';
import { LinesValidityProgress } from './components/linesValidityProgress/linesValidityProgress';
import { PieStatisticsForAllProviders } from './pieStatisticsForAllProviders';
import { useExportedLineStatisticsForAllProviders } from './apiHooks/useExportedLineStatisticsForAllProviders';
import { IncompleteLineStatisticsError } from './components/incompleteLineStatisticsError/incompleteLineStatisticsError';
import { LoadingLineStatistics } from './components/loadingLineStatistics';
import { Card } from './components/card/card';
import { validityCategoryLabel } from './lineStatistics.constants';
import style from './lineStatistics.module.scss';

export const LineStatisticsForAllProviders = () => {
  const { allProviders, allProvidersError } = useAllProviders();
  const { lineStatisticsForAllProviders, lineStatisticsForAllProvidersError } =
    useLineStatisticsForAllProviders();
  const {
    exportedLineStatisticsForAllProviders,
    exportedLineStatisticsForAllProvidersError,
  } = useExportedLineStatisticsForAllProviders(allProviders);

  const [selectedValidityCategory, setSelectedValidityCategory] =
    useState<Validity>(Validity.ALL);
  const [selectedProvider, setSelectedProvider] = useState<Provider>();

  const handlePieOnClick = (
    selectedValidityCategory: Validity,
    selectedProvider: Provider,
  ) => {
    setSelectedValidityCategory(selectedValidityCategory);
    setSelectedProvider(selectedProvider);
  };

  const handleShowAll = (provider: Provider) => {
    setSelectedValidityCategory(Validity.ALL);
    setSelectedProvider(provider);
  };

  const isLoading =
    (!allProviders && !allProvidersError) ||
    (!lineStatisticsForAllProviders && !lineStatisticsForAllProvidersError) ||
    (!exportedLineStatisticsForAllProviders &&
      !exportedLineStatisticsForAllProvidersError);

  return (
    <div className={style.lineStatisticsForAllProviders}>
      {selectedProvider ? (
        <Card
          handleClose={() => setSelectedProvider(undefined)}
          title={selectedProvider.name}
          subTitle={validityCategoryLabel[selectedValidityCategory]}
        >
          <LinesValidityProgress
            selectedValidityCategory={selectedValidityCategory}
            lineStatistics={
              lineStatisticsForAllProviders &&
              lineStatisticsForAllProviders[selectedProvider.id]
            }
            exportedLineStatistics={
              exportedLineStatisticsForAllProviders &&
              exportedLineStatisticsForAllProviders[selectedProvider.id]
            }
          />
        </Card>
      ) : (
        <LoadingLineStatistics
          isLoading={isLoading}
          lineStatisticsError={lineStatisticsForAllProvidersError}
          exportedLineStatisticsError={
            exportedLineStatisticsForAllProvidersError
          }
          providerError={allProvidersError}
        >
          <IncompleteLineStatisticsError
            lineStatisticsError={lineStatisticsForAllProvidersError}
            exportedLineStatisticsError={
              exportedLineStatisticsForAllProvidersError
            }
          />
          <div>
            {allProviders &&
              (lineStatisticsForAllProviders ||
                exportedLineStatisticsForAllProviders) && (
                <PieStatisticsForAllProviders
                  lineStatistics={lineStatisticsForAllProviders}
                  exportedLineStatistics={exportedLineStatisticsForAllProviders}
                  providers={allProviders}
                  handlePieOnClick={handlePieOnClick}
                  handleShowAll={handleShowAll}
                />
              )}
          </div>
        </LoadingLineStatistics>
      )}
    </div>
  );
};
