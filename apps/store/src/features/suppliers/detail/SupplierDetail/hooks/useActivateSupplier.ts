import type { ApiError } from '@ordero/api-types';
import { useToastManager } from '@ordero/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSupplier } from '@/lib/client/api/suppliers';
import { SUPPLIER_STATUS } from '@/lib/domain/suppliers';
import { suppliersQueryKeys } from '@/lib/query/suppliers/suppliersQueryKeys';
import { getApiErrorMessage } from '@/lib/utils/apiError';

type UseActivateSupplierArgs = {
  onActivated: () => Promise<void> | void;
  supplierId: number;
  supplierName: string;
};

export const useActivateSupplier = ({
  onActivated,
  supplierId,
  supplierName,
}: UseActivateSupplierArgs) => {
  const { add: addToast } = useToastManager();
  const queryClient = useQueryClient();
  const activateSupplierMutation = useMutation<void, ApiError>({
    mutationFn: async () => {
      const result = await updateSupplier({
        supplierId,
        status: SUPPLIER_STATUS.ACTIVE,
      });

      if (!result.ok) {
        throw result.error;
      }
    },
    onError: (error) => {
      addToast({ description: getApiErrorMessage(error), type: 'error' });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: suppliersQueryKeys.list }),
        queryClient.invalidateQueries({
          queryKey: suppliersQueryKeys.detail(supplierId),
        }),
      ]);
      addToast({
        description: `Supplier ${supplierName} was published`,
        type: 'success',
      });
      await onActivated();
    },
  });

  return {
    handleActivate: () => activateSupplierMutation.mutate(),
    isActivating: activateSupplierMutation.isPending,
  };
};
