import React, { useState } from 'react';
import { useLineStatisticsForProvider } from './apiHooks/useLineStatisticsForProvider';
import { LinesValidityProgress } from './components/linesValidity/linesValidityProgress';
import { useProvider } from './apiHooks/useProvider';
import { SmallAlertBox } from '@entur/alert';
import { PieChart } from './components/pieChart/pieChart';
import { segmentName2Key } from 'bogu/utils';
import style from './lineStatistics.module.scss';
import { withAuthenticationRequired } from '@auth0/auth0-react';

interface Props {
  providerId: string;
}

export const ProtectedLineStatisticsForProvider = (props: Props) => {
  const Cp = withAuthenticationRequired(LineStatisticsForProvider);
  return <Cp {...props} />;
};

const LineStatisticsForProvider = ({ providerId }: Props) => {
  const { lineStatistics, lineStatisticsError } =
    useLineStatisticsForProvider(providerId);
  const { provider, providerError } = useProvider(providerId);

  const [daysValid, setDaysValid] = useState<number>(180);
  const [selectedSegment, setSelectedSegment] = useState<string>('all');

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
      <div className={style.linesStatisticsForProvider}>
        {lineStatisticsError || providerError ? (
          <SmallAlertBox variant="error">
            Kunne ikke laste inn dataene. Prøv igjen senere.
          </SmallAlertBox>
        ) : (
          lineStatistics &&
          provider && (
            <div className={style.linesStatisticsContainer}>
              <LinesValidityProgress
                setSelectedSegment={setSelectedSegment}
                selectedSegment={selectedSegment}
                daysValid={daysValid}
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
