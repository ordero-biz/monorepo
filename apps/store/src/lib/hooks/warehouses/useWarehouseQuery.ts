'use client';

import { useQuery } from '@tanstack/react-query';
import { getWarehouse } from '@/lib/client/api/warehouses';
import { warehouseQueryOptions } from '@/lib/query/warehouses/warehousesQueryOptions';

export const useWarehouseQuery = (warehouseId: string | number) =>
  useQuery(warehouseQueryOptions(warehouseId, getWarehouse));
