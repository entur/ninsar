import React, { useState } from 'react';
import { useLineStatisticsForProvider } from './apiHooks/useLineStatisticsForProvider';
import { LinesValidityProgress } from './components/linesValidityProgress/linesValidityProgress';
import { useProvider } from './apiHooks/useProvider';
import { BannerAlertBox } from '@entur/alert';
import { PieStatistics } from './components/pieStatistics/pieStatistics';
import style from './lineStatistics.module.scss';
import { LineStatistics, Validity } from './lineStatistics.types';
import { useExportedLineStatisticsForProvider } from './apiHooks/useExportedLineStatisticsForProvider';
import { Heading3, Heading2 } from '@entur/typography';
import { validityCategoryLabel } from './lineStatistics.constants';
import { IncompleteLineStatisticsError } from './components/incompleteLineStatisticsError/incompleteLineStatisticsError';
import { LoadingLineStatistics } from './components/loadingLineStatistics';
import { Card } from './components/card/card';

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

  const hasLineStatistics = (lineStatistics?: LineStatistics): boolean =>
    !!(lineStatistics && lineStatistics.linesMap[providerId]);

  return (
    <div className={style.linesStatisticsForProvider}>
      <LoadingLineStatistics
        isLoading={isLoading}
        lineStatisticsError={lineStatisticsError}
        exportedLineStatisticsError={exportedLineStatisticsError}
        providerError={providerError}
      >
        <>
          {provider && (
            <>
              <IncompleteLineStatisticsError
                lineStatisticsError={lineStatisticsError}
                exportedLineStatisticsError={exportedLineStatisticsError}
              />
              <Heading2 className={style.providerTitle}>
                {provider.name}
              </Heading2>
              {hasLineStatistics(lineStatistics) ||
              hasLineStatistics(exportedLineStatistics) ? (
                <div className={style.linesStatisticsContainer}>
                  <Card
                    className={style.lineStatisticsCard}
                    subTitle={validityCategoryLabel[selectedValidityCategory]}
                  >
                    <LinesValidityProgress
                      selectedValidityCategory={selectedValidityCategory}
                      lineStatistics={lineStatistics}
                      exportedLineStatistics={exportedLineStatistics}
                    />
                  </Card>
                  <Card>
                    <PieStatistics
                      handlePieOnClick={handlePieOnClick}
                      handleShowAllClick={handleShowAll}
                      providerName={provider.name}
                      showHeader={false}
                      lineStatistics={lineStatistics}
                      exportedLineStatistics={exportedLineStatistics}
                      pieWidth={200}
                      pieHeight={300}
                    />
                  </Card>
                </div>
              ) : (
                <BannerAlertBox title="Fant ingen linjer" variant="info">
                  Last opp nytt datasett i Operatørportalen eller opprett linjer
                  i Nplan.
                </BannerAlertBox>
              )}
            </>
          )}
        </>
      </LoadingLineStatistics>
    </div>
  );
};
