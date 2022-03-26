import { color } from 'bogu/styles';
import React, { useState } from 'react';
import style from './pieChart.module.scss';
import { NumberOfLineType } from './pieChart.types';

export const NumberOfLines = ({
  numberOfInvalidLines,
  numberOfValidLines,
  numberOfExpiringLines,
  totalNumberOfLines,
}: NumberOfLineType) => {
  const [showTotal, setShowTotal] = useState<boolean>(true);

  return (
    <div
      onClick={() => setShowTotal(!showTotal)}
      style={{ color: color.font.info2 }}
      className={style.numberOfLines}
    >
      <span style={{ marginRight: 5 }}>Number of lines:</span>
      {showTotal ? (
        totalNumberOfLines
      ) : (
        <div>
          <span style={{ color: color.invalid }}>{numberOfInvalidLines}</span> /
          <span style={{ color: color.valid }}>{numberOfValidLines}</span> /
          <span style={{ color: color.expiring }}>{numberOfExpiringLines}</span>
        </div>
      )}
    </div>
  );
};
