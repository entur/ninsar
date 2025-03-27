import React, { useState } from 'react';
import { LineType, Provider, Validity } from './lineStatistics.types';
import style from './lineStatistics.module.scss';
import { useLocale } from '../appContext';
import { LineStatisticsPerProviderId } from './apiHooks/lineStatistics.response.types';
import { Card } from './components/card/card';
import { titleText } from './lineStatistics.constants';
import { LinesValidityList } from './components/linesValidity/linesValidityList';
import { LineTypeChips } from './components/linesValidity/linesFilters/lineTypeChips';

interface Props {
  onClose: () => void;
  allProviders: Provider[] | undefined;
  exportedLineStatistics: LineStatisticsPerProviderId | undefined;
  defaultSelectedLineType: LineType;
}

export const ExportedLineStatisticsForAllProviders = ({
  onClose,
  allProviders,
  exportedLineStatistics,
  defaultSelectedLineType,
}: Props) => {
  const locale = useLocale();
  const [selectedLineType, setSelectedLineType] = useState<LineType>(
    defaultSelectedLineType,
  );

  return (
    <div className={style.lineStatisticsForAllProviders}>
      <Card
        title={titleText(locale).allLinesFromNplan}
        className={style.lineStatisticsCard}
        handleClose={onClose}
      >
        <>
          <LineTypeChips
            selectedLineType={selectedLineType}
            setSelectedLineType={setSelectedLineType}
          />
          {allProviders &&
            exportedLineStatistics &&
            allProviders
              .filter((provider) =>
                Object.keys(exportedLineStatistics).some(
                  (key) => key === String(provider.id),
                ),
              )
              .map((provider, index) => (
                <LinesValidityList
                  key={'LinesValidityList' + index}
                  listTitle={provider.name}
                  lineStatistics={
                    exportedLineStatistics &&
                    exportedLineStatistics[provider.id]
                  }
                  defaultSelectedValidity={Validity.ALL}
                  selectedLineType={selectedLineType}
                />
              ))}
        </>
      </Card>
    </div>
  );
};
