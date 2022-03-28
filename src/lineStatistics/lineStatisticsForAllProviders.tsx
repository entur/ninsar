import { useAllProviders } from './apiHooks/useAllProviders';
import { useLineStatisticsForAllProviders } from './apiHooks/useLineStatisticsForAllProviders';
import { PieChart } from './components/pieChart/pieChart';
import { segmentName2Key } from 'bogu/utils';
import { useState } from 'react';
import style from './lineStatistics.module.scss';
import { SmallAlertBox } from '@entur/alert';

export const LineStatisticsForAllProviders = () => {
  const { allProviders, allProvidersError } = useAllProviders();
  const { lineStatisticsForAllProviders, lineStatisticsForAllProvidersError } =
    useLineStatisticsForAllProviders();

  const [, setDaysValid] = useState<number>(180);
  const [, setSelectedSegment] = useState<string>('all');

  const handlePieOnClick = (label: string | undefined) => {
    let selected = segmentName2Key(label);
    setSelectedSegment(selected.segment);
    setDaysValid(selected.daysValid);
  };

  const handleShowAll = () => {
    setSelectedSegment('all');
    setDaysValid(180);
  };

  const PieChartsForProvider = () => (
    <>
      {allProviders &&
        lineStatisticsForAllProviders &&
        allProviders.map((provider, index) => (
          <PieChart
            showHeader={true}
            key={'supplier-pie' + index}
            providerName={provider.name}
            handleShowAllClick={handleShowAll}
            handlePieOnClick={handlePieOnClick}
            lineStatistics={lineStatisticsForAllProviders[provider.id]}
            maintainAspectRatio={true}
          />
        ))}
    </>
  );

  return (
    <div className={style.linesStatisticsForAllProviders}>
      {allProvidersError || lineStatisticsForAllProvidersError ? (
        <SmallAlertBox variant="error">
          Kunne ikke laste inn dataene. Prøv igjen senere.
        </SmallAlertBox>
      ) : (
        <PieChartsForProvider />
      )}
    </div>
  );
};
