'use client';

import { useQuery } from '@tanstack/react-query';
import { getWarehouses } from '@/lib/client/api/warehouses';
import { warehousesListQueryOptions } from '@/lib/query/warehouses/warehousesQueryOptions';
import type { PaginationSearchInput } from '@/lib/utils/url';

export const useWarehousesQuery = (input?: PaginationSearchInput) =>
  useQuery(warehousesListQueryOptions(getWarehouses, input));
