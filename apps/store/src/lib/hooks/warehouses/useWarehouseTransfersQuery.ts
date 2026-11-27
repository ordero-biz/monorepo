'use client';

import { useQuery } from '@tanstack/react-query';
import { getWarehouseTransfers } from '@/lib/client/api/warehouses';
import { warehouseTransfersQueryOptions } from '@/lib/query/warehouses/warehousesQueryOptions';
import type { PaginationSearchInput } from '@/lib/utils/url';

export const useWarehouseTransfersQuery = (
  warehouseId: string | number,
  input?: PaginationSearchInput
) =>
  useQuery(
    warehouseTransfersQueryOptions({
      warehouseId,
      fetchWarehouseTransfers: getWarehouseTransfers,
      input,
    })
  );
