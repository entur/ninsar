import { color } from 'bogu/styles';
import { NumberOfLinesType } from './pieStatistics.types';
import { Validity } from '../../lineStatistics.types';

export const generatePieChartData = ({
  numberOfValidLines,
  numberOfExpiringLines,
  numberOfInvalidLines,
}: NumberOfLinesType) => ({
  labels: [Validity.VALID, Validity.EXPIRING, Validity.INVALID],
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
