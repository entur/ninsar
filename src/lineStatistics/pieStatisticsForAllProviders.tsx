import React from 'react';
import { PieChart } from './components/pieChart/pieChart';
import style from './lineStatistics.module.scss';
import { SmallAlertBox } from '@entur/alert';
import { Loader } from '@entur/loader';
import { Provider, Validity } from './lineStatistics.types';
import {
  FetchError,
  LineStatisticsPerProviderId,
} from './apiHooks/lineStatistics.response.types';

interface Props {
  lineStatistics?: LineStatisticsPerProviderId;
  lineStatisticsError?: FetchError;
  providers?: Provider[];
  providersError?: FetchError;
  handleShowAll: (provider: Provider) => void;
  handlePieOnClick: (validity: Validity, provider: Provider) => void;
}

export const PieStatisticsForAllProviders = ({
  lineStatistics,
  lineStatisticsError,
  providers,
  providersError,
  handleShowAll,
  handlePieOnClick,
}: Props) => {
  return (
    <div className={style.linesStatisticsForAllProviders}>
      {(!providers || !lineStatistics) &&
      !providersError &&
      !lineStatisticsError ? (
        <Loader style={{ width: '100%' }}>Laster</Loader>
      ) : providersError || lineStatisticsError ? (
        <SmallAlertBox variant="error">
          Kunne ikke laste inn dataene. Prøv igjen senere.
        </SmallAlertBox>
      ) : (
        providers &&
        lineStatistics &&
        providers
          .filter((provider) =>
            Object.keys(lineStatistics).some(
              (key) => key == String(provider.id),
            ),
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
              lineStatistics={lineStatistics[provider.id]}
              maintainAspectRatio={true}
            />
          ))
      )}
    </div>
  );
};
