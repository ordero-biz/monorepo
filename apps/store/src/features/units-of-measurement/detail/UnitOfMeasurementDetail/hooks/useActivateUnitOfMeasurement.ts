import type { ApiError } from '@ordero/api-types';
import { useToastManager } from '@ordero/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUnitOfMeasurement } from '@/lib/client/api/units-of-measurement';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/unitsOfMeasurement';
import { unitsOfMeasurementQueryKeys } from '@/lib/query/units-of-measurement/unitsOfMeasurementQueryKeys';
import { getApiErrorMessage } from '@/lib/utils/apiError';

type UseActivateUnitOfMeasurementArgs = {
  onActivated: () => Promise<void> | void;
  unitOfMeasurementId: number;
  unitOfMeasurementName: string;
};

export const useActivateUnitOfMeasurement = ({
  onActivated,
  unitOfMeasurementId,
  unitOfMeasurementName,
}: UseActivateUnitOfMeasurementArgs) => {
  const { add: addToast } = useToastManager();
  const queryClient = useQueryClient();
  const activateUnitOfMeasurementMutation = useMutation<void, ApiError>({
    mutationFn: async () => {
      const result = await updateUnitOfMeasurement({
        status: UNIT_OF_MEASUREMENT_STATUS.ACTIVE,
        unitOfMeasurementId,
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
        queryClient.invalidateQueries({
          queryKey: unitsOfMeasurementQueryKeys.list,
        }),
        queryClient.invalidateQueries({
          queryKey: unitsOfMeasurementQueryKeys.detail(unitOfMeasurementId),
        }),
      ]);
      addToast({
        description: `Unit of measurement ${unitOfMeasurementName} was published`,
        type: 'success',
      });
      await onActivated();
    },
  });

  return {
    handleActivate: () => activateUnitOfMeasurementMutation.mutate(),
    isActivating: activateUnitOfMeasurementMutation.isPending,
  };
};
