import React, { useState } from 'react';
import { useAllProviders } from './apiHooks/useAllProviders';
import { useLineStatisticsForAllProviders } from './apiHooks/useLineStatisticsForAllProviders';
import { Provider, Validity } from './lineStatistics.types';
import { LinesValidityProgress } from './components/linesValidityProgress/linesValidityProgress';
import { PieStatisticsForAllProviders } from './pieStatisticsForAllProviders';
import { useExportedLineStatisticsForAllProviders } from './apiHooks/useExportedLineStatisticsForAllProviders';
import { Loader } from '@entur/loader';
import { SmallAlertBox } from '@entur/alert';
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
    <>
      {selectedProvider ? (
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
          providerName={selectedProvider.name}
          handleClose={() => {
            setSelectedProvider(undefined);
          }}
        />
      ) : isLoading ? (
        <Loader style={{ width: '100%' }}>Laster</Loader>
      ) : allProvidersError ||
        (lineStatisticsForAllProvidersError &&
          exportedLineStatisticsForAllProvidersError) ? (
        <SmallAlertBox variant="error">
          Kunne ikke laste inn dataene. Prøv igjen senere.
        </SmallAlertBox>
      ) : (
        <div className={style.lineStatisticsErrorContainer}>
          {(lineStatisticsForAllProvidersError &&
            !exportedLineStatisticsForAllProvidersError && (
              <SmallAlertBox variant="error">
                Kunne ikke laste inn linjestatistikk for Operatørpotalen. Viser
                kun linjestatistikk for Nplan.
              </SmallAlertBox>
            )) ||
            (!lineStatisticsForAllProvidersError &&
              exportedLineStatisticsForAllProvidersError && (
                <SmallAlertBox variant="error">
                  Kunne ikke laste inn linjestatistikk for Nplan. Viser kun
                  linjestatistikk for Operatørpotalen.
                </SmallAlertBox>
              ))}
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
      )}
    </>
  );
};
