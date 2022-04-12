import React, { useState } from 'react';
import { useLineStatisticsForProvider } from './apiHooks/useLineStatisticsForProvider';
import { LinesValidityProgress } from './components/linesValidityProgress/linesValidityProgress';
import { useProvider } from './apiHooks/useProvider';
import { SmallAlertBox } from '@entur/alert';
import { PieChart } from './components/pieChart/pieChart';
import style from './lineStatistics.module.scss';
import { Loader } from '@entur/loader';
import { Validity } from './lineStatistics.types';
import { useExportedLineStatisticsForProvider } from './apiHooks/useExportedLineStatisticsForProvider';

interface Props {
  providerId: string;
}

export const LineStatisticsForProvider = ({ providerId }: Props) => {
  const { lineStatistics, lineStatisticsError } =
    useLineStatisticsForProvider(providerId);
  const { provider, providerError } = useProvider(providerId);
  const { exportedLineStatistics, exportedLineStatisticsError } =
    useExportedLineStatisticsForProvider(provider);

  const [selectedValidityCategory, setSelectedValidityCategory] =
    useState<Validity>(Validity.ALL);

  const handlePieOnClick = (selectedValidityCategory: Validity) => {
    setSelectedValidityCategory(selectedValidityCategory);
  };

  const handleShowAll = () => {
    setSelectedValidityCategory(Validity.ALL);
  };

  const isLoading =
    (!provider && !providerError) ||
    (!lineStatistics && !lineStatisticsError) ||
    (!exportedLineStatistics && !exportedLineStatisticsError);

  return (
    <>
      <div className={style.linesStatisticsForProvider}>
        {isLoading ? (
          <Loader style={{ width: '100%' }}>Laster</Loader>
        ) : providerError ||
          (lineStatisticsError && exportedLineStatisticsError) ? (
          <SmallAlertBox variant="error">
            Kunne ikke laste inn dataene. Prøv igjen senere.
          </SmallAlertBox>
        ) : (
          <div className={style.lineStatisticsErrorContainer}>
            {(lineStatisticsError && !exportedLineStatisticsError && (
              <SmallAlertBox variant="error">
                Kunne ikke laste inn linjestatistikk for Operatørpotalen. Viser
                kun linjestatistikk for Nplan.
              </SmallAlertBox>
            )) ||
              (!lineStatisticsError && exportedLineStatisticsError && (
                <SmallAlertBox variant="error">
                  Kunne ikke laste inn linjestatistikk for Nplan. Viser kun
                  linjestatistikk for Operatørpotalen.
                </SmallAlertBox>
              ))}
            {lineStatistics && provider && (
              <div className={style.linesStatisticsContainer}>
                <LinesValidityProgress
                  selectedValidityCategory={selectedValidityCategory}
                  lineStatistics={lineStatistics}
                  exportedLineStatistics={exportedLineStatistics}
                  providerName={provider.name}
                />
                <PieChart
                  handlePieOnClick={handlePieOnClick}
                  handleShowAllClick={handleShowAll}
                  providerName={provider.name}
                  showHeader={false}
                  lineStatistics={lineStatistics}
                  exportedLineStatistics={exportedLineStatistics}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
