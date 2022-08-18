import React, { useState } from 'react';
import { useAllProviders } from './apiHooks/useAllProviders';
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
import { PieStatistics } from "./components/pieStatistics/pieStatistics";
import { getNumberOfLinesType } from "./components/numberOfLines/numberOfLines.util";
import { Heading2 } from "@entur/typography"

export const ExportedLineStatisticsForAllProviders = () => {
  const locale = useLocale();
  const { allProviders, allProvidersError } = useAllProviders();
  const {
    exportedLineStatisticsForAllProviders,
    exportedLineStatisticsForAllProvidersError,
  } = useExportedLineStatisticsForAllProviders(allProviders);

  const [selectedValidityCategory, setSelectedValidityCategory] =
    useState<Validity>(Validity.ALL);

  const handlePieOnClick = (
    selectedValidityCategory: Validity,
  ) => {
    setSelectedValidityCategory(selectedValidityCategory);
  };

  const handleShowAll = (provider: Provider) => {
    setSelectedValidityCategory(Validity.ALL);
  };

  const isLoading =
    (!allProviders && !allProvidersError) ||
    (!exportedLineStatisticsForAllProviders &&
     !exportedLineStatisticsForAllProvidersError);

  return (
    <div className={style.lineStatisticsForAllProviders}>
      <LoadingLineStatistics
        isLoading={isLoading}
        exportedLineStatisticsError={
          exportedLineStatisticsForAllProvidersError
        }
        providerError={allProvidersError}
      >
        <IncompleteLineStatisticsError
          exportedLineStatisticsError={
            exportedLineStatisticsForAllProvidersError
          }
        />
        <div>
          {allProviders &&
           exportedLineStatisticsForAllProviders && (
             allProviders
               .filter(
                 (provider) =>
                   Object.keys(exportedLineStatisticsForAllProviders).some(
                     (key) => key === String(provider.id),
                   ),
               )
               .map((provider, index) => (
                 <>
                   <Heading2>{provider.name}</Heading2>
                   <LinesValidity
                     defaultSelectedValidity={selectedValidityCategory}
                     lineStatistics={undefined}
                     exportedLineStatistics={
           exportedLineStatisticsForAllProviders &&
           exportedLineStatisticsForAllProviders[provider.id]
                     }
                   />
                 </>)))}
        </div>
      </LoadingLineStatistics>
    </div>
  );
};
