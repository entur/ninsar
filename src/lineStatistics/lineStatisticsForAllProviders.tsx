import { useLineStatisticsForAllProviders } from './apiHooks/useLineStatisticsForAllProviders';
import { PieStatisticsForAllProviders } from './pieStatisticsForAllProviders';
import React from 'react';
import { LoadingLineStatistics } from './components/loadingLineStatistics';
import { IncompleteLineStatisticsError } from './components/incompleteLineStatisticsError/incompleteLineStatisticsError';

type Props = {
  handleShowAll: (providerId: string) => void;
};

export const LineStatisticsForAllProviders = ({ handleShowAll }: Props) => {
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
              handlePieOnClick={(_, providerId) => handleShowAll(providerId)}
              handleShowAll={(providerId) => handleShowAll(providerId)}
            />
          </div>
        )}
      </>
    </LoadingLineStatistics>
  );
};
