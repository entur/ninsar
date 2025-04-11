import { useLocale } from '../../appContext';
import { useAllProviders } from '../../lineStatistics/apiHooks/useAllProviders';
import { useLineStatisticsForAllProviders } from './useLineStatisticsForAllProviders';
import { PieStatisticsForAllProviders } from './pieStatisticsForAllProviders';
import React from 'react';

type Props = {
  handleShowAll: (providerId: number) => void;
}

export const LineStatisticsForAllProviders = ({handleShowAll}: Props) => {
  const { allProviders } = useAllProviders();
  const { lineStatisticsForAllProviders } =
    useLineStatisticsForAllProviders();

  return (
    <>
      {allProviders && lineStatisticsForAllProviders && (
        <div>
          <PieStatisticsForAllProviders
            lineStatistics={lineStatisticsForAllProviders}
            providers={allProviders}
            handlePieOnClick={(_, provider) => handleShowAll(provider.id)}
            handleShowAll={(provider) => handleShowAll(provider.id)}
          />
        </div>
      )}
    </>
  );
};
