import { SortingChips } from "./sortingChips";
import React from "react";

interface Props {
  sorting: number;
  setSorting: (sorting: number) => void;
}

export const LinesFilters = ({ sorting, setSorting }: Props) => {
  return (
    <SortingChips sorting={sorting} setSorting={setSorting} />
  )
}
