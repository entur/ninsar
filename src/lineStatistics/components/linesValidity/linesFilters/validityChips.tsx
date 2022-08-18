import { ChoiceChip, ChoiceChipGroup } from "@entur/chip";
import React from "react";
import { useLocale } from "../../../../appContext";
import { titleText, validityCategoryLabel } from "../../../lineStatistics.constants";
import { useRandomId } from "@entur/utils";
import { Validity } from "../../../lineStatistics.types";

interface Props {
  selectedValidity: Validity;
  setSelectedValidity: (selectedValidity: Validity) => void;
}

export const ValidityChips = ({ selectedValidity, setSelectedValidity }: Props) => {

  const randomId = useRandomId('validity');
  const locale = useLocale();

  return (
    <div style={{ marginBottom: '20px' }}>
      <ChoiceChipGroup
        name={randomId}
        label={titleText(locale).selectLines}
        onChange={e => setSelectedValidity(Validity[e.target.value as keyof typeof Validity])}
        value={`${selectedValidity}`}
      >
        <ChoiceChip value={Validity.ALL}>{validityCategoryLabel(locale)[Validity.ALL]}</ChoiceChip>
        <ChoiceChip value={Validity.VALID}>{validityCategoryLabel(locale)[Validity.VALID]}</ChoiceChip>
        <ChoiceChip value={Validity.INVALID}>{validityCategoryLabel(locale)[Validity.INVALID]}</ChoiceChip>
        <ChoiceChip value={Validity.EXPIRING}>{validityCategoryLabel(locale)[Validity.EXPIRING]}</ChoiceChip>
      </ChoiceChipGroup>
    </div>
  );
}