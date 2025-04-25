/*
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 */

import React from 'react';
import style from './linesValidity.module.scss';
import { useLocale } from '../../../appContext';
import { LineStatistics, Validity } from '../../lineStatistics.types';
import { titleText } from '../../lineStatistics.constants';
import { LinesValidityList } from './linesValidityList';

interface Props {
  providerId: string;
  defaultSelectedValidity: Validity;
  lineStatistics: LineStatistics | undefined;
}

export const LinesValidity = ({
  providerId,
  lineStatistics,
  defaultSelectedValidity,
}: Props) => {
  const locale = useLocale();
  const hasLines = (lineStatistics: LineStatistics) =>
    (lineStatistics.validityCategories.get(Validity.ALL)?.length ?? 0) > 0;

  return (
    <div className={style.linesListContainer}>
      {lineStatistics && hasLines(lineStatistics) && (
        <LinesValidityList
          providerId={providerId}
          listTitle={titleText(locale).lineStatisticsFromChouette}
          lineStatistics={lineStatistics}
          defaultSelectedValidity={defaultSelectedValidity}
        />
      )}
    </div>
  );
};
