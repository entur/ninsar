import { useState } from 'react';
import { useLineStatistics } from './hooks/useLineStatistics';
import { useParams } from 'react-router-dom';
import { LineStatisticsCard } from './components/lineStatisticsCard/lineStatisticsCard';
import { useProvider } from './hooks/useProvider';
import { SmallAlertBox } from '@entur/alert';

type Provider = {
  providerId: string;
};

export const LineStatisticsForProvider = () => {
  const { providerId } = useParams<Provider>();
  const { lineStatistics, lineStatisticsError } = useLineStatistics(providerId);
  const { provider, providerError } = useProvider(providerId);

  console.log('useLineStatistics(providerId)', lineStatistics);

  const [daysValid, setDaysValid] = useState<number>(180);
  const [selectedSegment, setSelectedSegment] = useState<string>('all');

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
          lineStatistics &&
          provider && (
            <>
              <LineStatisticsCard
                setSelectedSegment={setSelectedSegment}
                selectedSegment={selectedSegment}
                daysValid={daysValid}
                lineStatistics={lineStatistics}
                title={provider.name}
              />
              <div>Pie Diagram</div>
            </>
          )
        )}
      </div>
    </>
  );
};
