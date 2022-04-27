import { Heading3, Heading5 } from '@entur/typography';
import { Card } from '../card/card';
import { errorText, titleText } from '../../lineStatistics.constants';
import { useLocale } from '../../../appProvider';
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
      <Heading5>{titleText(locale).latestDeliveryDate}</Heading5>
      <LoadingOrFailed
        errorText={errorText(locale).failedToLoadLatestDate}
        isLoading={!latestDeliveryDate && !latestDeliveryDateError}
        error={!!latestDeliveryDateError}
      >
        <Heading3>{latestDeliveryDate}</Heading3>
      </LoadingOrFailed>
    </Card>
  );
};
