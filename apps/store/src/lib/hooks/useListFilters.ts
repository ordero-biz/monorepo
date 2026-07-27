'use client';

import { useState } from 'react';

type UseListFiltersArgs<TFilters extends object> = {
  initialFilters: TFilters;
};

export const useListFilters = <TFilters extends object>({
  initialFilters,
}: UseListFiltersArgs<TFilters>) => {
  const [filters, setFiltersState] = useState(initialFilters);
  const setFilters = (nextFilters: Partial<TFilters>) => {
    setFiltersState((currentFilters) => ({
      ...currentFilters,
      ...nextFilters,
    }));
  };
  const resetFilters = () => {
    setFiltersState(initialFilters);
  };

  return { filters, resetFilters, setFilters };
};
