import React, { useState } from 'react';
import { useLineStatisticsForProvider } from './apiHooks/useLineStatisticsForProvider';
import { LinesValidityProgress } from './components/linesValidityProgress/linesValidityProgress';
import { useProvider } from './apiHooks/useProvider';
import { BannerAlertBox } from '@entur/alert';
import { PieStatistics } from './components/pieStatistics/pieStatistics';
import { LineStatistics, Validity } from './lineStatistics.types';
import { useExportedLineStatisticsForProvider } from './apiHooks/useExportedLineStatisticsForProvider';
import { Heading2 } from '@entur/typography';
import { infoText, validityCategoryLabel } from './lineStatistics.constants';
import { IncompleteLineStatisticsError } from './components/incompleteLineStatisticsError/incompleteLineStatisticsError';
import { LoadingLineStatistics } from './components/loadingLineStatistics';
import { Card } from './components/card/card';
import { useLocale } from '../appProvider';
import { useLatestDeliveryDate } from './apiHooks/useLatestDeliveryDate';
import { LatestDeliveryDate } from './components/latestDeliveryDate/latestDeliveryDate';
import style from './lineStatistics.module.scss';

interface Props {
  providerId: string;
}

export const LineStatisticsForProvider = ({ providerId }: Props) => {
  useLatestDeliveryDate(providerId);
  const locale = useLocale();
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
    !!(
      lineStatistics &&
      (lineStatistics.validityCategories.get(Validity.ALL)?.length ?? 0) > 0
    );

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
                    subTitle={
                      validityCategoryLabel(locale)[selectedValidityCategory]
                    }
                  >
                    <LinesValidityProgress
                      selectedValidityCategory={selectedValidityCategory}
                      lineStatistics={lineStatistics}
                      exportedLineStatistics={exportedLineStatistics}
                    />
                  </Card>
                  <div className={style.rightPanel}>
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
                    <LatestDeliveryDate providerId={providerId} />
                  </div>
                </div>
              ) : (
                <BannerAlertBox title="Fant ingen linjer" variant="info">
                  {infoText(locale).noLinesFound}
                </BannerAlertBox>
              )}
            </>
          )}
        </>
      </LoadingLineStatistics>
    </div>
  );
};
