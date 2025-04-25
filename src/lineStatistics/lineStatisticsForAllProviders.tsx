import { useLineStatisticsForAllProviders } from './apiHooks/useLineStatisticsForAllProviders';
import { PieStatisticsForAllProviders } from './pieStatisticsForAllProviders';
import React from 'react';
import { LoadingLineStatistics } from './components/loadingLineStatistics';
import { IncompleteLineStatisticsError } from './components/incompleteLineStatisticsError/incompleteLineStatisticsError';

type Props = {
  setSelectedProvider: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const LineStatisticsForAllProviders = ({
  setSelectedProvider,
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
              // TODO this needs to be implemented
              handlePieOnClick={() => {}}
              handleShowAll={(providerId) => setSelectedProvider(providerId)}
            />
          </div>
        )}
      </>
    </LoadingLineStatistics>
  );
};
