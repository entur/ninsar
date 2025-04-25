import { useLineStatisticsForAllProviders } from './apiHooks/useLineStatisticsForAllProviders';
import { PieStatisticsForAllProviders } from './pieStatisticsForAllProviders';
import React from 'react';
import { LoadingLineStatistics } from './components/loadingLineStatistics';
import { IncompleteLineStatisticsError } from './components/incompleteLineStatisticsError/incompleteLineStatisticsError';

export const LineStatisticsForAllProviders = () => {
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
              handlePieOnClick={() => {}}
              handleShowAll={() => {}}
            />
          </div>
        )}
      </>
    </LoadingLineStatistics>
  );
};
