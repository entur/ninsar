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
import { TertiaryButton } from '@entur/button';

Chart.register([ArcElement, Tooltip, Legend]);

interface Props {
  handlePieOnClick: (label: Validity) => void;
  handleShowAllClick: () => void;
  showHeader: boolean;
  lineStatistics?: LineStatistics;
  exportedLineStatistics?: LineStatistics;
  providerName: string;
  maintainAspectRatio?: boolean;
}

export const PieChart = ({
  providerName,
  handlePieOnClick,
  handleShowAllClick,
  showHeader,
  lineStatistics,
  exportedLineStatistics,
  maintainAspectRatio = false,
}: Props) => {
  const numberOfLinesForValidityCategory = (validity: Validity) =>
    (lineStatistics?.validityCategories.get(validity)?.length ?? 0) +
    (exportedLineStatistics?.validityCategories.get(validity)?.length ?? 0);

  const numberOfLinesType: NumberOfLineType = {
    totalNumberOfLines: numberOfLinesForValidityCategory(Validity.ALL),
    numberOfValidLines: numberOfLinesForValidityCategory(Validity.VALID),
    numberOfInvalidLines: numberOfLinesForValidityCategory(Validity.INVALID),
    numberOfExpiringLines: numberOfLinesForValidityCategory(Validity.EXPIRING),
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

      <TertiaryButton
        style={{ paddingTop: '7px' }}
        onClick={handleShowAllClick}
      >
        Show all
      </TertiaryButton>
    </div>
  );
};
