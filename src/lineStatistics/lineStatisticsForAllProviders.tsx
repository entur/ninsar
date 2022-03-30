import React, { useState } from 'react';
import { useAllProviders } from './apiHooks/useAllProviders';
import { useLineStatisticsForAllProviders } from './apiHooks/useLineStatisticsForAllProviders';
import { PieChart } from './components/pieChart/pieChart';
import { segmentName2Key } from 'bogu/utils';
import style from './lineStatistics.module.scss';
import { SmallAlertBox } from '@entur/alert';
import { Loader } from '@entur/loader';
import { Provider } from './lineStatistics.types';
import { LinesValidityProgress } from './components/linesValidity/linesValidityProgress';

export const LineStatisticsForAllProviders = () => {
  const { allProviders, allProvidersError } = useAllProviders();
  const { lineStatisticsForAllProviders, lineStatisticsForAllProvidersError } =
    useLineStatisticsForAllProviders();

  const [daysValid, setDaysValid] = useState<number>(180);
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [selectedProvider, setSelectedProvider] = useState<Provider>();

  const handlePieOnClick = (label: string, provider: Provider) => {
    let selected = segmentName2Key(label);
    setSelectedSegment(selected.segment);
    setDaysValid(selected.daysValid);
    setSelectedProvider(provider);
  };

  const handleShowAll = (provider: Provider) => {
    setSelectedSegment('all');
    setDaysValid(180);
    setSelectedProvider(provider);
  };

  return (
    <>
      {selectedProvider ? (
        <>
          {lineStatisticsForAllProviders && (
            <LinesValidityProgress
              setSelectedSegment={setSelectedSegment}
              selectedSegment={selectedSegment}
              daysValid={daysValid}
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
                handlePieOnClick={(label: string) =>
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
