import type { ApiError } from '@ordero/api-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getWarehouse, updateWarehouse } from '@/lib/client/api/warehouses';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import type { Warehouse } from '@/lib/domain/warehouses/types';
import { warehousesQueryKeys } from '@/lib/query/warehouses/warehousesQueryKeys';
import { warehouseQueryOptions } from '@/lib/query/warehouses/warehousesQueryOptions';

export const useReviewTransferWarehouse = (warehouseId: number) => {
  const queryClient = useQueryClient();

  const warehouseQuery = useQuery({
    ...warehouseQueryOptions(warehouseId, getWarehouse),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: 'always',
  });

  const publishWarehouse = useMutation<Warehouse, ApiError>({
    mutationFn: async () => {
      const result = await updateWarehouse({
        warehouseId,
        status: WAREHOUSE_STATUS.ACTIVE,
      });

      if (!result.ok) {
        throw result.error;
      }

      if (result.data.status !== WAREHOUSE_STATUS.ACTIVE) {
        throw {
          status: 409,
          message:
            'Publishing could not be confirmed. Check the warehouse status and try again.',
        } satisfies ApiError;
      }

      return result.data;
    },
    onSuccess: (warehouse) => {
      queryClient.setQueryData(
        warehousesQueryKeys.detail(warehouse.id),
        warehouse
      );
      queryClient.invalidateQueries({ queryKey: warehousesQueryKeys.list });
    },
  });

  return {
    warehouseQuery,
    publishWarehouse,
  };
};
