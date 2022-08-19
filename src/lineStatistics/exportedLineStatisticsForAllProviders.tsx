import React from 'react';
import { Provider, Validity } from './lineStatistics.types';
import style from './lineStatistics.module.scss';
import { useLocale } from '../appContext';
import { LineStatisticsPerProviderId } from "./apiHooks/lineStatistics.response.types";
import { Card } from "./components/card/card";
import { titleText } from "./lineStatistics.constants";
import { LinesValidityList } from "./components/linesValidity/linesValidityList";

interface Props {
  onClose: () => void;
  allProviders: Provider[] | undefined;
  exportedLineStatistics: LineStatisticsPerProviderId | undefined;
}

export const ExportedLineStatisticsForAllProviders = ({ onClose, allProviders, exportedLineStatistics }: Props) => {
  const locale = useLocale();
  return (
    <div className={style.lineStatisticsForAllProviders}>
      <Card
        title={titleText(locale).allLinesFromNplan}
        className={style.lineStatisticsCard}
        handleClose={onClose}
      >
        <>
          {allProviders &&
           exportedLineStatistics && (
             allProviders
               .filter(
                 (provider) =>
                   Object.keys(exportedLineStatistics).some(
                     (key) => key === String(provider.id),
                   ),
               )
               .map((provider, index) => (
                   <LinesValidityList
                     listTitle={provider.name}
                     lineStatistics={exportedLineStatistics && exportedLineStatistics[provider.id]}
                     defaultSelectedValidity={Validity.ALL}
                   />
                 )
               )
           )}
        </>
      </Card>
    </div>
  );
};
