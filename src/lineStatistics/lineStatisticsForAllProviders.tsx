import { useLineStatisticsForAllProviders } from './apiHooks/useLineStatisticsForAllProviders';
import { PieStatisticsForAllProviders } from './pieStatisticsForAllProviders';
import React from 'react';

type Props = {
  handleShowAll: (providerId: string) => void;
}

export const LineStatisticsForAllProviders = ({handleShowAll}: Props) => {
  const { lineStatisticsForAllProviders } =
    useLineStatisticsForAllProviders();

  return (
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
  );
};
