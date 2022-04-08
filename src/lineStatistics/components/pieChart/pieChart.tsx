import { LineStatistics, Validity } from '../../lineStatistics.types';
import React from 'react';
import style from './pieChart.module.scss';
import { NumberOfLines } from './numberOfLines';
import { generatePieChartData, pieChartOptions } from './pieChart.data';
import { NumberOfLineType } from './pieChart.types';
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

Chart.register([ArcElement, Tooltip, Legend]);

interface Props {
  handlePieOnClick: (label: Validity) => void;
  handleShowAllClick: () => void;
  showHeader: boolean;
  lineStatistics: LineStatistics;
  providerName: string;
  maintainAspectRatio?: boolean;
}

export const PieChart = ({
  providerName,
  handlePieOnClick,
  handleShowAllClick,
  showHeader,
  lineStatistics,
  maintainAspectRatio = false,
}: Props) => {

  const numberOfLinesType: NumberOfLineType = {
    totalNumberOfLines:
      lineStatistics.validityCategories.get(Validity.ALL)?.length ?? 0,
    numberOfValidLines:
      lineStatistics.validityCategories.get(Validity.VALID)?.length ?? 0,
    numberOfInvalidLines:
      lineStatistics.validityCategories.get(Validity.INVALID)?.length ?? 0,
    numberOfExpiringLines:
      lineStatistics.validityCategories.get(Validity.EXPIRING)?.length ?? 0,
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
          maintainAspectRatio: maintainAspectRatio,
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

      <NumberOfLines {...numberOfLinesType} />

      <div onClick={() => handleShowAllClick()} className={style.showAll}>
        Show all
      </div>
    </div>
  );
};
