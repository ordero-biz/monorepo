import type { ApiError } from '@ordero/api-types';
import { useToastManager } from '@ordero/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateWarehouse } from '@/lib/client/api/warehouses';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { warehousesQueryKeys } from '@/lib/query/warehouses/warehousesQueryKeys';
import { getApiErrorMessage } from '@/lib/utils/apiError';

type UseActivateWarehouseArgs = {
  onActivated: () => Promise<void> | void;
  warehouseId: number;
  warehouseName: string;
};

export const useActivateWarehouse = ({
  onActivated,
  warehouseId,
  warehouseName,
}: UseActivateWarehouseArgs) => {
  const { add: addToast } = useToastManager();
  const queryClient = useQueryClient();
  const activateWarehouseMutation = useMutation<void, ApiError>({
    mutationFn: async () => {
      const result = await updateWarehouse({
        warehouseId,
        status: WAREHOUSE_STATUS.ACTIVE,
      });

      if (!result.ok) {
        throw result.error;
      }
    },
    onError: (error) => {
      addToast({
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: warehousesQueryKeys.list }),
        queryClient.invalidateQueries({
          queryKey: warehousesQueryKeys.detail(warehouseId),
        }),
      ]);
      addToast({
        description: `Warehouse ${warehouseName} was published`,
        type: 'success',
      });
      await onActivated();
    },
  });

  return {
    handleActivate: () => activateWarehouseMutation.mutate(),
    isActivating: activateWarehouseMutation.isPending,
  };
};
