'use client';

import { useQuery } from '@tanstack/react-query';
import { getWarehouseSupplies } from '@/lib/client/api/warehouses';
import { warehouseSuppliesQueryOptions } from '@/lib/query/warehouses/warehousesQueryOptions';
import type { PaginationSearchInput } from '@/lib/utils/url';

export const useWarehouseSuppliesQuery = (
  warehouseId: string | number,
  input?: PaginationSearchInput
) =>
  useQuery(
    warehouseSuppliesQueryOptions({
      warehouseId,
      fetchWarehouseSupplies: getWarehouseSupplies,
      input,
    })
  );
