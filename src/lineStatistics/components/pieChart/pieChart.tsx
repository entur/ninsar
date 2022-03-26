import { FormattedLineStatistics } from '../../lineStatistics.types';
import React from 'react';
import style from './pieChart.module.scss';
import { NumberOfLines } from './numberOfLines';
import { generatePieChartData, pieChartOptions } from './pieChart.data';
import { NumberOfLineType } from './pieChart.types';
import { Pie } from 'react-chartjs-2';
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  ChartEvent,
  ActiveElement,
  ChartType,
  DefaultDataPoint,
} from 'chart.js';

Chart.register([ArcElement, Tooltip, Legend]);

interface Props {
  handlePieOnClick: (label: string | undefined) => void;
  handleShowAllClick: () => void;
  showHeader: boolean;
  formattedLineStatistics: FormattedLineStatistics;
  providerName: string;
}

export const PieChart = ({
  providerName,
  handlePieOnClick,
  handleShowAllClick,
  showHeader,
  formattedLineStatistics,
}: Props) => {
  const numberOfLinesType: NumberOfLineType = {
    totalNumberOfLines: formattedLineStatistics.all.lineNumbers.length,
    numberOfValidLines: formattedLineStatistics.valid.lineNumbers.length,
    numberOfInvalidLines: formattedLineStatistics.invalid.lineNumbers.length,
    numberOfExpiringLines: formattedLineStatistics.expiring.lineNumbers.length,
  };

  return (
    <div className={style.pieChartContainer}>
      {showHeader && <div className={style.header}>{providerName}</div>}
      <Pie
        style={{ marginTop: 0 }}
        data={generatePieChartData(numberOfLinesType)}
        width={100}
        height={100}
        options={{
          ...pieChartOptions,
          onClick(
            event: ChartEvent,
            elements: ActiveElement[],
            chart: Chart<ChartType, DefaultDataPoint<ChartType>, string>,
          ) {
            handlePieOnClick(
              chart.data.labels
                ? chart.data.labels[elements[0].index]
                : undefined,
            );
            console.log(event, elements, chart);
          },
        }}
      />

      <NumberOfLines {...numberOfLinesType} />

      <div onClick={() => handleShowAllClick()} className={style.showAll}>
        Show all
      </div>
    </div>
  );
};
