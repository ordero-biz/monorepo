'use client';

import { useQuery } from '@tanstack/react-query';
import { getWarehouseStock } from '@/lib/client/api/warehouses';
import { warehouseStockQueryOptions } from '@/lib/query/warehouses/warehousesQueryOptions';
import type { PaginationSearchInput } from '@/lib/utils/url';

export const useWarehouseStockQuery = (
  warehouseId: string | number,
  input?: PaginationSearchInput
) =>
  useQuery(
    warehouseStockQueryOptions({
      warehouseId,
      fetchWarehouseStock: getWarehouseStock,
      input,
    })
  );
