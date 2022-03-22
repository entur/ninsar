import { useState } from 'react';
import { useLineStatistics } from '../hooks/useLineStatistics';
import { useParams } from 'react-router-dom';

type Provider = {
  providerId: string;
};

export const LineStatisticsForProvider = () => {
  const { providerId } = useParams<Provider>();
  useLineStatistics(providerId);

  const [daysValid, setDaysValid] = useState<number>(180);
  const [selectedSegment, setSelectedSegment] = useState<string>('all');

  return <div> Line Statistics for Provider {providerId} </div>;
};
