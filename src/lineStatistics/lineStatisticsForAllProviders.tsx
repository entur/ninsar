import React, { useState } from 'react';
import { useAllProviders } from './apiHooks/useAllProviders';
import { useLineStatisticsForAllProviders } from './apiHooks/useLineStatisticsForAllProviders';
import { PieChart } from './components/pieChart/pieChart';
import style from './lineStatistics.module.scss';
import { SmallAlertBox } from '@entur/alert';
import { Loader } from '@entur/loader';
import { Provider, Validity } from './lineStatistics.types';
import { LinesValidityProgress } from './components/linesValidity/linesValidityProgress';

export const LineStatisticsForAllProviders = () => {
  const { allProviders, allProvidersError } = useAllProviders();
  const { lineStatisticsForAllProviders, lineStatisticsForAllProvidersError } =
    useLineStatisticsForAllProviders();

  const [selectedValidityCategory, setSelectedValidityCategory] =
    useState<Validity>(Validity.ALL);
  const [selectedProvider, setSelectedProvider] = useState<Provider>();

  const handlePieOnClick = (selectedValidityCategory: Validity, provider: Provider) => {
    setSelectedValidityCategory(selectedValidityCategory);
    setSelectedProvider(provider);
  };

  const handleShowAll = (provider: Provider) => {
    setSelectedValidityCategory(Validity.ALL);
    setSelectedProvider(provider);
  };

  return (
    <>
      {selectedProvider ? (
        <>
          {lineStatisticsForAllProviders && (
            <LinesValidityProgress
              selectedValidityCategory={selectedValidityCategory}
              lineStatistics={
                lineStatisticsForAllProviders[selectedProvider.id]
              }
              providerName={selectedProvider.name}
              handleClose={() => {
                setSelectedProvider(undefined);
              }}
            />
          )}
        </>
      ) : (
        <div className={style.linesStatisticsForAllProviders}>
          {(!allProviders || !lineStatisticsForAllProviders) &&
          !allProvidersError &&
          !lineStatisticsForAllProvidersError ? (
            <Loader style={{ width: '100%' }}>Laster</Loader>
          ) : allProvidersError || lineStatisticsForAllProvidersError ? (
            <SmallAlertBox variant="error">
              Kunne ikke laste inn dataene. Prøv igjen senere.
            </SmallAlertBox>
          ) : (
            allProviders &&
            lineStatisticsForAllProviders &&
            allProviders.map((provider, index) => (
              <PieChart
                showHeader={true}
                key={'provider-pie' + index}
                providerName={provider.name}
                handleShowAllClick={() => handleShowAll(provider)}
                handlePieOnClick={(label: Validity) =>
                  handlePieOnClick(label, provider)
                }
                lineStatistics={lineStatisticsForAllProviders[provider.id]}
                maintainAspectRatio={true}
              />
            ))
          )}
        </div>
      )}
    </>
  );
};
