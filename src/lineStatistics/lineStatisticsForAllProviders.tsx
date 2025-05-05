import { useLineStatisticsForAllProviders } from './apiHooks/useLineStatisticsForAllProviders';
import { PieStatisticsForAllProviders } from './pieStatisticsForAllProviders';
import React from 'react';
import { LoadingLineStatistics } from './components/loadingLineStatistics';
import { IncompleteLineStatisticsError } from './components/incompleteLineStatisticsError/incompleteLineStatisticsError';
import { Validity } from './lineStatistics.types';

type Props = {
  setSelectedProvider: React.Dispatch<React.SetStateAction<string | undefined>>;
  setSelectedValidity: React.Dispatch<React.SetStateAction<Validity>>;
};

export const LineStatisticsForAllProviders = ({
  setSelectedProvider,
  setSelectedValidity,
}: Props) => {
  const { lineStatisticsForAllProviders, loading, error } =
    useLineStatisticsForAllProviders();

  return (
    <LoadingLineStatistics isLoading={loading} lineStatisticsError={error}>
      <IncompleteLineStatisticsError lineStatisticsError={error} />
      <>
        {lineStatisticsForAllProviders && (
          <div>
            <PieStatisticsForAllProviders
              lineStatistics={lineStatisticsForAllProviders}
              handlePieOnClick={(validity, providerId) => {
                setSelectedValidity(validity);
                setSelectedProvider(providerId);
              }}
              handleShowAll={(providerId) => {
                setSelectedValidity(Validity.ALL);
                setSelectedProvider(providerId);
              }}
            />
          </div>
        )}
      </>
    </LoadingLineStatistics>
  );
};
