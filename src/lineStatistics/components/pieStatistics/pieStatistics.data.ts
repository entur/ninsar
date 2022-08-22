import { NumberOfLinesType } from './pieStatistics.types';
import { Validity } from '../../lineStatistics.types';

export const color = {
  valid: '#33c146',
  expired: '#b20000',
  expiring: '#FFAA00',
  highlight: {
    valid: '#4caf50',
    expiring: '#FFB60A',
    expired: '#cc0000',
  }
}

export const generatePieChartData = ({
  numberOfValidLines,
  numberOfExpiringLines,
  numberOfExpiredLines,
}: NumberOfLinesType) => ({
  labels: [Validity.VALID, Validity.EXPIRING, Validity.INVALID],
  datasets: [
    {
      data: [numberOfValidLines, numberOfExpiringLines, numberOfExpiredLines],
      backgroundColor: [
        color.highlight.valid,
        color.highlight.expiring,
        color.highlight.expired,
      ],
      hoverBackgroundColor: [color.valid, color.expiring, color.expired],
    },
  ],
});

export const pieChartOptions = {
  showTooltips: true,
  responsive: true,
  tooltipTemplate: '<%= label %> - <%= value %>',
  cursor: 'pointer',
};
