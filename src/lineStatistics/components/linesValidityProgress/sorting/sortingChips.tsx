import { ChoiceChip, ChoiceChipGroup } from "@entur/chip";
import { DownwardIcon, UpwardIcon, CloseIcon } from "@entur/icons";
import React from "react";
import { useLocale } from "../../../../appContext";
import { titleText } from "../../../lineStatistics.constants";

interface Props {
  id: string;
  sorting: number;
  setSorting: (sorting: number) => void;
}

export const SortingChips = ({ id, sorting, setSorting }: Props) => {

  const locale = useLocale();

  return (
    <div style={{ marginBottom: '20px' }}>
      <ChoiceChipGroup
        name={id}
        label={titleText(locale).sortLines}
        onChange={e => setSorting(Number(e.target.value))}
        value={`${sorting}`}
      >
        <ChoiceChip value="0"><CloseIcon /></ChoiceChip>
        <ChoiceChip value="1">AZ <DownwardIcon /></ChoiceChip>
        <ChoiceChip value="2">ZA <UpwardIcon /></ChoiceChip>
        <ChoiceChip value="3">{titleText(locale).numberOfDays} <DownwardIcon /></ChoiceChip>
        <ChoiceChip value="4">{titleText(locale).numberOfDays} <UpwardIcon /></ChoiceChip>
      </ChoiceChipGroup>
    </div>
  );
}