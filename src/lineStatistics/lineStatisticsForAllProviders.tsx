import React, { useState } from 'react';
import { useAllProviders } from './apiHooks/useAllProviders';
import { useLineStatisticsForAllProviders } from './apiHooks/useLineStatisticsForAllProviders';
import { useUttuLinesStatisticsForAllProviders } from './apiHooks/useUttuLinesStatisticsForAllProviders';
import { Provider, Validity } from './lineStatistics.types';
import { LinesValidityProgress } from './components/linesValidityProgress/linesValidityProgress';
import { LineStatisticsPerProviderId } from './apiHooks/lineStatistics.response.types';
import { PieStatisticsForAllProviders } from './pieStatisticsForAllProviders';

export const LineStatisticsForAllProviders = () => {
  const { allProviders, allProvidersError } = useAllProviders();
  const { lineStatisticsForAllProviders, lineStatisticsForAllProvidersError } =
    useLineStatisticsForAllProviders();
  const {
    exportedLineStatisticsForAllProviders,
    exportedLineStatisticsForAllProvidersError,
  } = useUttuLinesStatisticsForAllProviders(allProviders);

  const [selectedValidityCategory, setSelectedValidityCategory] =
    useState<Validity>(Validity.ALL);
  const [selectedProvider, setSelectedProvider] = useState<Provider>();
  const [selectedLineStatistics, setSelectedLineStatistics] =
    useState<LineStatisticsPerProviderId>();

  const handlePieOnClick = (
    selectedValidityCategory: Validity,
    selectedProvider: Provider,
    selectedLineStatistics?: LineStatisticsPerProviderId,
  ) => {
    setSelectedValidityCategory(selectedValidityCategory);
    setSelectedProvider(selectedProvider);
    setSelectedLineStatistics(selectedLineStatistics);
  };

  const handleShowAll = (
    provider: Provider,
    selectedLineStatistics?: LineStatisticsPerProviderId,
  ) => {
    setSelectedValidityCategory(Validity.ALL);
    setSelectedProvider(provider);
    setSelectedLineStatistics(selectedLineStatistics);
  };

  return (
    <>
      {selectedProvider ? (
        <>
          {selectedLineStatistics && (
            <LinesValidityProgress
              selectedValidityCategory={selectedValidityCategory}
              lineStatistics={selectedLineStatistics[selectedProvider.id]}
              providerName={selectedProvider.name}
              handleClose={() => {
                setSelectedProvider(undefined);
              }}
            />
          )}
        </>
      ) : (
        <>
          <PieStatisticsForAllProviders
            lineStatistics={exportedLineStatisticsForAllProviders}
            lineStatisticsError={exportedLineStatisticsForAllProvidersError}
            providers={allProviders}
            providersError={allProvidersError}
            handlePieOnClick={(
              selectedValidityCategory: Validity,
              selectedProvider: Provider,
            ) =>
              handlePieOnClick(
                selectedValidityCategory,
                selectedProvider,
                exportedLineStatisticsForAllProviders,
              )
            }
            handleShowAll={(selectedProvider: Provider) => {
              handleShowAll(
                selectedProvider,
                exportedLineStatisticsForAllProviders,
              );
            }}
          />
          <PieStatisticsForAllProviders
            lineStatistics={lineStatisticsForAllProviders}
            lineStatisticsError={lineStatisticsForAllProvidersError}
            providers={allProviders}
            providersError={allProvidersError}
            handlePieOnClick={(
              selectedValidityCategory: Validity,
              selectedProvider: Provider,
            ) =>
              handlePieOnClick(
                selectedValidityCategory,
                selectedProvider,
                lineStatisticsForAllProviders,
              )
            }
            handleShowAll={(selectedProvider: Provider) => {
              handleShowAll(selectedProvider, lineStatisticsForAllProviders);
            }}
          />
        </>
      )}
    </>
  );
};
