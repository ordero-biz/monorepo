import type { ApiError } from '@ordero/api-types';
import { useToastManager } from '@ordero/ui';
import { useMutation } from '@tanstack/react-query';
import { deleteUnitsOfMeasurement } from '@/lib/client/api/units-of-measurement';

type UseDeleteUnitOfMeasurementArgs = {
  onDeleted: () => Promise<void> | void;
  unitOfMeasurementId: number;
  unitOfMeasurementName: string;
};

export const useDeleteUnitOfMeasurement = ({
  onDeleted,
  unitOfMeasurementId,
  unitOfMeasurementName,
}: UseDeleteUnitOfMeasurementArgs) => {
  const { add: addToast } = useToastManager();

  const deleteUnitOfMeasurementMutation = useMutation<void, ApiError>({
    mutationFn: async () => {
      const result = await deleteUnitsOfMeasurement({
        unitOfMeasurementIds: [unitOfMeasurementId],
      });

      if (!result.ok) {
        throw result.error;
      }
    },
    onError: (error) => {
      addToast({
        description: error.message,
        type: 'error',
      });
    },
    onSuccess: async () => {
      addToast({
        description: `Unit of measurement ${unitOfMeasurementName} was deleted.`,
        type: 'success',
      });
      await onDeleted();
    },
  });

  return {
    handleDelete: () => deleteUnitOfMeasurementMutation.mutate(),
    isDeleting: deleteUnitOfMeasurementMutation.isPending,
  };
};
