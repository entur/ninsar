import { Validity } from '../../lineStatistics.types';
import React from 'react';
import style from './pieStatistics.module.scss';
import { ExpandableNumberOfLines } from './expandableNumberOfLines';
import { generatePieChartData, pieChartOptions } from './pieStatistics.data';
import { NumberOfLinesType } from './pieStatistics.types';
import { Pie } from 'react-chartjs-2';
import {
  ActiveElement,
  ArcElement,
  Chart,
  ChartEvent,
  ChartType,
  DefaultDataPoint,
  Legend,
  Tooltip,
} from 'chart.js';
import { Button } from '@entur/button';
import { Heading6 } from '@entur/typography';
import { titleText } from '../../lineStatistics.constants';
import { useLocale } from '../../../appContext';
import classnames from 'classnames';

Chart.register([ArcElement, Tooltip, Legend]);

interface Props {
  handlePieOnClick: (label: Validity) => void;
  handleShowAllClick: () => void;
  showHeader: boolean;
  providerName: string;
  pieWidth: number;
  pieHeight: number;
  numberOfLines: NumberOfLinesType;
  className?: string;
}

export const PieStatistics = ({
  providerName,
  handlePieOnClick,
  handleShowAllClick,
  showHeader,
  pieHeight,
  pieWidth,
  numberOfLines,
  className = '',
}: Props) => {
  const locale = useLocale();
  return (
    <div className={classnames(style.pieChartContainer, className)}>
      {showHeader && (
        <div className={style.headerContainer}>
          <Heading6 className={style.header}>{providerName}</Heading6>
        </div>
      )}
      <div style={{ width: `${pieWidth}px`, height: `${pieHeight}px` }}>
        <Pie
          style={{ marginTop: 0 }}
          data={generatePieChartData(numberOfLines)}
          width={100}
          height={100}
          options={{
            ...pieChartOptions,
            maintainAspectRatio: false,
            onClick(
              event: ChartEvent,
              elements: ActiveElement[],
              chart: Chart<ChartType, DefaultDataPoint<ChartType>, Validity>,
            ) {
              chart.data.labels &&
                chart.data.labels.length > 0 &&
                elements.length > 0 &&
                handlePieOnClick(chart.data.labels[elements[0].index]);
            },
          }}
        />
      </div>

      <ExpandableNumberOfLines {...numberOfLines} />

      <Button
        width="fluid"
        variant="tertiary"
        size="medium"
        onClick={handleShowAllClick}
      >
        {titleText(locale).showAll}
      </Button>
    </div>
  );
};
