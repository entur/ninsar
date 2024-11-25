import React from 'react';
import { ChoiceChip, ChoiceChipGroup } from '@entur/chip';
import { useLocale } from '../../../../appContext';
import { lineTypeLabel, titleText } from '../../../lineStatistics.constants';
import { useRandomId } from '@entur/utils';
import { LineType } from '../../../lineStatistics.types';

interface Props {
  selectedLineType: LineType;
  setSelectedLineType: (selectedValidity: LineType) => void;
}

export const LineTypeChips = ({
  selectedLineType,
  setSelectedLineType,
}: Props) => {
  const randomId = useRandomId('lineType');
  const locale = useLocale();

  return (
    <div style={{ marginBottom: '20px' }}>
      <ChoiceChipGroup
        name={randomId}
        label={titleText(locale).selectLineTypes}
        onChange={(e) =>
          setSelectedLineType(LineType[e.target.value as keyof typeof LineType])
        }
        value={`${selectedLineType}`}
      >
        <ChoiceChip value={LineType.ALL}>
          {lineTypeLabel(locale)[LineType.ALL]}
        </ChoiceChip>
        <ChoiceChip value={LineType.FIXED}>
          {lineTypeLabel(locale)[LineType.FIXED]}
        </ChoiceChip>
        <ChoiceChip value={LineType.FLEXIBLE}>
          {lineTypeLabel(locale)[LineType.FLEXIBLE]}
        </ChoiceChip>
      </ChoiceChipGroup>
    </div>
  );
};
