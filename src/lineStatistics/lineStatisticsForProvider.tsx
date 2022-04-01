import React, { useState } from 'react';
import { useLineStatisticsForProvider } from './apiHooks/useLineStatisticsForProvider';
import { LinesValidityProgress } from './components/linesValidity/linesValidityProgress';
import { useProvider } from './apiHooks/useProvider';
import { SmallAlertBox } from '@entur/alert';
import { PieChart } from './components/pieChart/pieChart';
import style from './lineStatistics.module.scss';
import { Loader } from '@entur/loader';
import { Validity } from './lineStatistics.types';
import { getValidityNameFromLabel } from './utilities';

interface Props {
  providerId: string;
}

export const LineStatisticsForProvider = ({ providerId }: Props) => {
  const { lineStatistics, lineStatisticsError } =
    useLineStatisticsForProvider(providerId);
  const { provider, providerError } = useProvider(providerId);

  const [selectedValidityCategory, setSelectedValidityCategory] =
    useState<string>(Validity.ALL);

  const handlePieOnClick = (label: string) => {
    setSelectedValidityCategory(
      getValidityNameFromLabel(label) || Validity.ALL,
    );
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
