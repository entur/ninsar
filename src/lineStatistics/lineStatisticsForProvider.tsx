import { useLineStatisticsForProvider } from './apiHooks/useLineStatisticsForProvider';
import style from './lineStatistics.module.scss';
import { Card } from './components/card/card';
import { LinesValidity } from './components/linesValidity/linesValidity';
import React from 'react';
import { Validity } from './lineStatistics.types';
import { LoadingLineStatistics } from './components/loadingLineStatistics';
import { PieStatistics } from './components/pieStatistics/pieStatistics';
import { getNumberOfLinesType } from './components/numberOfLines/numberOfLines.util';
import { useAppConfig } from '../appContext';
import { NumberOfLines } from './components/numberOfLines/numberOfLines';
import { DaysToFirstExpiringLine } from './components/daysInFirstLineExpiration/daysToFirstExpiringLine';
import { LatestDeliveryDate } from './components/latestDeliveryDate/latestDeliveryDate';

type Props = {
  providerId: string;
  setSelectedProvider: React.Dispatch<React.SetStateAction<string | undefined>>;
};
export const LineStatisticsForProvider = ({
  providerId,
  setSelectedProvider,
}: Props) => {
  const { lineStatistics, loading, error } =
    useLineStatisticsForProvider(providerId);

  const appConfig = useAppConfig();

  const numberOfLines = getNumberOfLinesType(lineStatistics);

  return (
    <LoadingLineStatistics isLoading={loading} lineStatisticsError={error}>
      <>
        {!loading && !error && (
          <div className={style.linesStatisticsContainer}>
            <Card
              title={lineStatistics?.providerName}
              className={style.lineStatisticsCard}
              // TODO close button should not be shown when user is not admin
              handleClose={() => setSelectedProvider(undefined)}
            >
              <LinesValidity
                providerId={providerId}
                defaultSelectedValidity={Validity.ALL}
                lineStatistics={lineStatistics}
              />
            </Card>
            <div className={style.rightPanel}>
              <Card>
                <PieStatistics
                  handlePieOnClick={() => {}}
                  handleShowAllClick={() => {}}
                  providerName={lineStatistics?.providerName!}
                  showHeader={false}
                  numberOfLines={numberOfLines}
                  className={style.pieChartContainer}
                  showLineButton={false}
                />
              </Card>
              {appConfig.showNumberOfLinesCard && (
                <NumberOfLines numberOfLines={numberOfLines} />
              )}
              {appConfig.showExpiringDaysCard && lineStatistics && (
                <DaysToFirstExpiringLine lineStatistics={lineStatistics} />
              )}
              {appConfig.showDeliveryDateCard && (
                <LatestDeliveryDate providerId={providerId} />
              )}
            </div>
          </div>
        )}
      </>
    </LoadingLineStatistics>
  );
};
