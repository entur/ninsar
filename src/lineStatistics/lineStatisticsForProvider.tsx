import React, { useState } from 'react';
import { useLineStatisticsForProvider } from './apiHooks/useLineStatisticsForProvider';
import { LinesValidityProgress } from './components/linesValidityProgress/linesValidityProgress';
import { useProvider } from './apiHooks/useProvider';
import { SmallAlertBox } from '@entur/alert';
import { PieChart } from './components/pieChart/pieChart';
import style from './lineStatistics.module.scss';
import { Loader } from '@entur/loader';
import { Validity } from './lineStatistics.types';

interface Props {
  providerId: string;
}

export const LineStatisticsForProvider = ({ providerId }: Props) => {
  const { lineStatistics, lineStatisticsError } =
    useLineStatisticsForProvider(providerId);
  const { provider, providerError } = useProvider(providerId);

  const [selectedValidityCategory, setSelectedValidityCategory] =
    useState<Validity>(Validity.ALL);

  const handlePieOnClick = (selectedValidityCategory: Validity) => {
    setSelectedValidityCategory(selectedValidityCategory);
  };

  const handleShowAll = () => {
    setSelectedValidityCategory(Validity.ALL);
  };

  return (
    <>
      <div className={style.linesStatisticsForProvider}>
        {(!provider || !lineStatistics) &&
        !providerError &&
        !lineStatisticsError ? (
          <Loader style={{ width: '100%' }}>Laster</Loader>
        ) : lineStatisticsError || providerError ? (
          <SmallAlertBox variant="error">
            Kunne ikke laste inn dataene. Prøv igjen senere.
          </SmallAlertBox>
        ) : (
          lineStatistics &&
          provider && (
            <div className={style.linesStatisticsContainer}>
              <LinesValidityProgress
                selectedValidityCategory={selectedValidityCategory}
                lineStatistics={lineStatistics}
                providerName={provider.name}
              />
              <PieChart
                handlePieOnClick={handlePieOnClick}
                handleShowAllClick={handleShowAll}
                providerName={provider.name}
                showHeader={false}
                lineStatistics={lineStatistics}
              />
            </div>
          )
        )}
      </div>
    </>
  );
};
