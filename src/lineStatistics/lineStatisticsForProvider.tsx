import { useState } from 'react';
import { useLineStatistics } from './hooks/useLineStatistics';
import { useParams } from 'react-router-dom';
import { LineStatisticsCard } from './components/lineStatisticsCard/lineStatisticsCard';

type Provider = {
  providerId: string;
};

export const LineStatisticsForProvider = () => {
  const { providerId } = useParams<Provider>();
  const { lineStatistics, error } = useLineStatistics(providerId);

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
        {lineStatistics && (
            <>
                <LineStatisticsCard
                    selectedSegment={selectedSegment}
                    daysValid={daysValid}
                    lineStatistics={lineStatistics}
                    title={'SomeThing'}
                />
                <div>Pie Diagram</div>
            </>
        )}
      </div>
    </>
  );
};
