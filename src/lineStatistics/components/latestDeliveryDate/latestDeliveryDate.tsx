import { Heading1, Heading4 } from '@entur/typography';
import { Card } from '../card/card';
import { errorText, titleText } from '../../lineStatistics.constants';
import { useLocale } from '../../../appContext';
import { useLatestDeliveryDate } from '../../apiHooks/useLatestDeliveryDate';
import { LoadingOrFailed } from '../LoadingOrFailed';
import style from './latestDeliveryDate.module.scss';

interface Props {
  providerId: string;
}

export const LatestDeliveryDate = ({ providerId }: Props) => {
  const locale = useLocale();
  const { latestDeliveryDate, latestDeliveryDateError } =
    useLatestDeliveryDate(providerId);
  return (
    <Card className={style.latestDeliveryDate}>
      <Heading4>{titleText(locale).latestDeliveryDate}</Heading4>
      <LoadingOrFailed
        errorText={errorText(locale).failedToLoadLatestDate}
        isLoading={!latestDeliveryDate && !latestDeliveryDateError}
        error={!!latestDeliveryDateError}
      >
        <Heading1 className={style.date}>{latestDeliveryDate}</Heading1>
      </LoadingOrFailed>
    </Card>
  );
};
