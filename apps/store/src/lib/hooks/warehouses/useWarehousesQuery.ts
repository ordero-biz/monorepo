'use client';

import { useQuery } from '@tanstack/react-query';
import { getWarehouses } from '@/lib/client/api/warehouses';
import { warehousesListQueryOptions } from '@/lib/query/warehouses/warehousesQueryOptions';

export const useWarehousesQuery = () =>
  useQuery(warehousesListQueryOptions(getWarehouses));
