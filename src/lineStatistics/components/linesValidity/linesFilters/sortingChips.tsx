import { ChoiceChip, ChoiceChipGroup } from "@entur/chip";
import { DownwardIcon, UpwardIcon } from "@entur/icons";
import React from "react";
import { useLocale } from "../../../../appContext";
import { titleText } from "../../../lineStatistics.constants";
import { useRandomId } from "@entur/utils";

interface Props {
  sorting: number;
  setSorting: (sorting: number) => void;
}

export const SortingChips = ({ sorting, setSorting }: Props) => {

  const randomId = useRandomId('sorting');
  const locale = useLocale();

  return (
    <div style={{ marginBottom: '20px' }}>
      <ChoiceChipGroup
        name={randomId}
        label={titleText(locale).sortLines}
        onChange={e => setSorting(Number(e.target.value))}
        value={`${!!sorting ? sorting : 1}`}
      >
        <ChoiceChip value="1">AZ <DownwardIcon /></ChoiceChip>
        <ChoiceChip value="2">ZA <UpwardIcon /></ChoiceChip>
        <ChoiceChip value="4">{titleText(locale).numberOfDays} <DownwardIcon /></ChoiceChip>
        <ChoiceChip value="3">{titleText(locale).numberOfDays} <UpwardIcon /></ChoiceChip>
      </ChoiceChipGroup>
    </div>
  );
}