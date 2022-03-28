import { useAllProviders } from './apiHooks/useAllProviders';
import { useLineStatisticsForAllProviders } from './apiHooks/useLineStatisticsForAllProviders';
import { PieChart } from './components/pieChart/pieChart';
import { segmentName2Key } from 'bogu/utils';
import { useState } from 'react';
import style from './lineStatistics.module.scss';

export const LineStatisticsForAllProviders = () => {
  const { allProviders, allProvidersError } = useAllProviders();
  const { lineStatisticsForAllProviders, lineStatisticsForAllProvidersError } =
    useLineStatisticsForAllProviders();

  const [daysValid, setDaysValid] = useState<number>(180);
  const [selectedSegment, setSelectedSegment] = useState<string>('all');

  console.log('allProviders', allProviders);
  console.log('lineStatisticsForAllProviders', lineStatisticsForAllProviders);

  const handlePieOnClick = (label: string | undefined) => {
    let selected = segmentName2Key(label);
    setSelectedSegment(selected.segment);
    setDaysValid(selected.daysValid);
  };

  const handleShowAll = () => {
    setSelectedSegment('all');
    setDaysValid(180);
  };

  const providerPies =
    allProviders &&
    lineStatisticsForAllProviders &&
    allProviders.map((provider, index) => (
      <PieChart
        showHeader={true}
        key={'supplier-pie' + index}
        providerName={provider.name}
        handleShowAllClick={handleShowAll}
        handlePieOnClick={handlePieOnClick}
        lineStatistics={lineStatisticsForAllProviders[provider.id]}
      />
    ));

  return (
    <>
      <div className={style.linesStatisticsForAllProviders}>{providerPies}</div>
    </>
  );
};
