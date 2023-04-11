import { Validity } from '../../lineStatistics.types';
import React from 'react';
import style from './pieStatistics.module.scss';
import { generatePieChartData } from './pieStatistics.data';
import { NumberOfLinesType } from './pieStatistics.types';
import { Doughnut } from 'react-chartjs-2';
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
import { Heading5 } from '@entur/typography';
import { titleText } from '../../lineStatistics.constants';
import { useLocale } from '../../../appContext';
import classnames from 'classnames';

Chart.register([ArcElement, Tooltip, Legend]);

interface Props {
  handlePieOnClick: (label: Validity) => void;
  handleShowAllClick: () => void;
  showHeader: boolean;
  providerName: string;
  pieWidth?: number;
  pieHeight?: number;
  numberOfLines: NumberOfLinesType;
  className?: string;
  showLineButton: boolean;
}

export const PieStatistics = ({
  providerName,
  handlePieOnClick,
  handleShowAllClick,
  showHeader,
  pieHeight = 180,
  pieWidth = 230,
  numberOfLines,
  className = '',
  showLineButton,
}: Props) => {
  const locale = useLocale();

  const totalNumberOfLines = {
    id: 'totalNumberOfLines',
    beforeDatasetsDraw(chart: Chart) {
      const { ctx, data, legend } = chart;

      const hiddenLegends = legend?.legendItems?.filter((item) => item.hidden);
      const hiddenLegendsIndexes = hiddenLegends?.map((item) =>
        legend?.legendItems?.indexOf(item),
      );

      const dataNotHidden = data.datasets[0].data.filter(
        (value, index) => !hiddenLegendsIndexes?.includes(index),
      );

      ctx.save();
      ctx.font = 'bold 20px sans-serif';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        `${dataNotHidden
          .map((d) => Number(d))
          .reduce((a, b) => (a ?? 0) + (b ?? 0), 0)}`,
        chart.getDatasetMeta(0).data[0].x,
        chart.getDatasetMeta(0).data[0].y,
      );
    },
  };

  return (
    <div className={classnames(style.pieChartContainer, className)}>
      {showHeader && (
        <div className={style.headerContainer}>
          <Heading5 className={style.header}>{providerName}</Heading5>
        </div>
      )}
      <div
        style={{
          width: `${pieWidth}px`,
          height: `${pieHeight}px`,
          margin: '10px 0',
        }}
      >
        <Doughnut
          data={generatePieChartData(numberOfLines)}
          plugins={[totalNumberOfLines]}
          options={{
            responsive: true,
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
            plugins: {
              tooltip: {
                callbacks: {
                  title: (context) => {
                    const label = context[0].label;
                    return label.charAt(0) + label.slice(1).toLowerCase();
                  },
                  label: (context) => {
                    const { chart } = context;
                    return `${
                      chart.data.datasets[context.datasetIndex].data[
                        context.dataIndex
                      ]
                    }`;
                  },
                },
                backgroundColor: '#FFF',
                titleAlign: 'center',
                titleFont: {
                  size: 16,
                },
                titleColor: '#0066ff',
                titleMarginBottom: 10,
                bodyColor: '#000',
                bodyAlign: 'center',
                bodyFont: {
                  size: 14,
                },
                displayColors: false,
                borderColor: '#0066ff',
                borderWidth: 1,
              },
              legend: {
                labels: {
                  usePointStyle: true,
                  pointStyle: 'rectRounded',
                },
                align: 'start',
                position: 'bottom',
              },
            },
          }}
        />
      </div>

      {showLineButton && (
        <Button
          width="fluid"
          variant="tertiary"
          size="medium"
          onClick={handleShowAllClick}
        >
          {titleText(locale).showLines}
        </Button>
      )}
    </div>
  );
};
