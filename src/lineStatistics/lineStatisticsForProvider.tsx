import { useEffect, useState } from 'react';
import { useLineStatistics } from './hooks/useLineStatistics';
import { useParams } from 'react-router-dom';
import { LinesValidity } from './components/linesValidity/linesValidity';
import { useProvider } from './hooks/useProvider';
import { SmallAlertBox } from '@entur/alert';
import { PieChart } from './components/pieChart/pieChart';
import { FormattedLineStatistics } from './lineStatistics.types';
import { formatLineStats } from 'bogu/utils';
import { segmentName2Key } from 'bogu/utils';
import style from './lineStatistics.module.scss';

export const LineStatisticsForProvider = () => {
  const { providerId } = useParams<{
    providerId: string;
  }>();
  const { lineStatistics, lineStatisticsError } = useLineStatistics(providerId);
  const { provider, providerError } = useProvider(providerId);

  const [daysValid, setDaysValid] = useState<number>(180);
  const [selectedSegment, setSelectedSegment] = useState<string>('all');

  const [formattedLineStatistics, setFormattedLineStatistics] =
    useState<FormattedLineStatistics>();

  useEffect(() => {
    if (!!lineStatistics) {
      const formatted = formatLineStats(lineStatistics);
      setFormattedLineStatistics(formatted);
    }
  }, [lineStatistics, setFormattedLineStatistics]);

  const handlePieOnClick = (label: string | undefined) => {
    let selected = segmentName2Key(label);
    setSelectedSegment(selected.segment);
    setDaysValid(selected.daysValid);
  };

  const handleShowAll = () => {
    setSelectedSegment('all');
    setDaysValid(180);
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
        }}
      >
        {lineStatisticsError || providerError ? (
          <SmallAlertBox variant="error">
            Kunne ikke laste inn dataene. Prøv igjen senere.
          </SmallAlertBox>
        ) : (
          formattedLineStatistics &&
          provider && (
            <div className={style.linesStatisticsContainer}>
              <LinesValidity
                setSelectedSegment={setSelectedSegment}
                selectedSegment={selectedSegment}
                daysValid={daysValid}
                formattedLineStatistics={formattedLineStatistics}
                providerName={provider.name}
              />
              <PieChart
                handlePieOnClick={handlePieOnClick}
                handleShowAllClick={handleShowAll}
                providerName={provider.name}
                showHeader={false}
                formattedLineStatistics={formattedLineStatistics}
              />
            </div>
          )
        )}
      </div>
    </>
  );
};
