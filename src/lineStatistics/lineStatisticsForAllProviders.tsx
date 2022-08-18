import React, { useState } from 'react';
import { useAllProviders } from './apiHooks/useAllProviders';
import { useLineStatisticsForAllProviders } from './apiHooks/useLineStatisticsForAllProviders';
import { Provider, Validity } from './lineStatistics.types';
import { LinesValidity } from './components/linesValidity/linesValidity';
import { PieStatisticsForAllProviders } from './pieStatisticsForAllProviders';
import { useExportedLineStatisticsForAllProviders } from './apiHooks/useExportedLineStatisticsForAllProviders';
import {
  IncompleteLineStatisticsError
} from './components/incompleteLineStatisticsError/incompleteLineStatisticsError';
import { LoadingLineStatistics } from './components/loadingLineStatistics';
import { Card } from './components/card/card';
import { validityCategoryLabel } from './lineStatistics.constants';
import style from './lineStatistics.module.scss';
import { useLocale } from '../appContext';
import { Button, FloatingButton } from "@entur/button";

export const LineStatisticsForAllProviders = () => {
  const locale = useLocale();
  const { allProviders, allProvidersError } = useAllProviders();
  const { lineStatisticsForAllProviders, lineStatisticsForAllProvidersError } =
    useLineStatisticsForAllProviders();
  const {
    exportedLineStatisticsForAllProviders,
    exportedLineStatisticsForAllProvidersError,
  } = useExportedLineStatisticsForAllProviders(allProviders);

  const [defaultSelectedValidity, setDefaultSelectedValidity] =
    useState<Validity>(Validity.ALL);
  const [selectedProvider, setSelectedProvider] = useState<Provider>();

  const handlePieOnClick = (
    selectedValidityCategory: Validity,
    selectedProvider: Provider,
  ) => {
    setDefaultSelectedValidity(selectedValidityCategory);
    setSelectedProvider(selectedProvider);
  };

  const handleShowAll = (provider: Provider) => {
    setDefaultSelectedValidity(Validity.ALL);
    setSelectedProvider(provider);
  };

  const isLoading =
    (!allProviders && !allProvidersError) ||
    (!lineStatisticsForAllProviders && !lineStatisticsForAllProvidersError) ||
    (!exportedLineStatisticsForAllProviders &&
     !exportedLineStatisticsForAllProvidersError);

  return (
    <div className={style.lineStatisticsForAllProviders}>
      {selectedProvider ? (
        <Card
          handleClose={() => setSelectedProvider(undefined)}
          title={selectedProvider.name}
        >
          <LinesValidity
            defaultSelectedValidity={defaultSelectedValidity}
            lineStatistics={
              lineStatisticsForAllProviders &&
              lineStatisticsForAllProviders[selectedProvider.id]
            }
            exportedLineStatistics={
              exportedLineStatisticsForAllProviders &&
              exportedLineStatisticsForAllProviders[selectedProvider.id]
            }
          />
        </Card>
      ) : (
        <LoadingLineStatistics
          isLoading={isLoading}
          lineStatisticsError={lineStatisticsForAllProvidersError}
          exportedLineStatisticsError={
            exportedLineStatisticsForAllProvidersError
          }
          providerError={allProvidersError}
        >
          <IncompleteLineStatisticsError
            lineStatisticsError={lineStatisticsForAllProvidersError}
            exportedLineStatisticsError={
              exportedLineStatisticsForAllProvidersError
            }
          />
          <div>
            {allProviders &&
             (lineStatisticsForAllProviders ||
              exportedLineStatisticsForAllProviders) && (
               <>
                 <FloatingButton
                   size="medium"
                   aria-label={"Show"}
                   onClick={() => {
                   }}
                   style={{ margin: "20px" }}
                 >
                   Vis oversikt over alle linjer fra Nplan.
                 </FloatingButton>
                 <PieStatisticsForAllProviders
                   lineStatistics={lineStatisticsForAllProviders}
                   exportedLineStatistics={exportedLineStatisticsForAllProviders}
                   providers={allProviders}
                   handlePieOnClick={handlePieOnClick}
                   handleShowAll={handleShowAll}
                 />
               </>
             )}
          </div>
        </LoadingLineStatistics>
      )}
    </div>
  );
};
