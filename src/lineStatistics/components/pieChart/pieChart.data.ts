import { segmentName } from 'bogu/utils';
import { color } from 'bogu/styles';
import { NumberOfLineType } from './pieChart.types';

export const generatePieChartData = ({
  numberOfValidLines,
  numberOfExpiringLines,
  numberOfInvalidLines,
}: NumberOfLineType) => ({
  labels: [
    segmentName('valid'),
    segmentName('expiring'),
    segmentName('invalid'),
  ],
  datasets: [
    {
      data: [numberOfValidLines, numberOfExpiringLines, numberOfInvalidLines],
      backgroundColor: [
        color.highlight.valid,
        color.highlight.expiring,
        color.highlight.invalid,
      ],
      hoverBackgroundColor: [color.valid, color.expiring, color.invalid],
    },
  ],
});

export const pieChartOptions = {
  showTooltips: true,
  responsive: true,
  tooltipTemplate: '<%= label %> - <%= value %>',
  cursor: 'pointer',
};
