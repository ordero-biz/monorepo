'use client';

import type { ApiError } from '@ordero/api-types';
import { useMutation } from '@tanstack/react-query';
import { deleteUnitsOfMeasurement } from '@/lib/client/api/units-of-measurement';
import { useToastManager } from '@/ui/index';

type UseDeleteUnitsOfMeasurementArgs = {
  onDeleted: () => Promise<void> | void;
  unitOfMeasurementIds: number[];
};

const getSuccessDescription = (unitOfMeasurementIds: number[]) => {
  if (unitOfMeasurementIds.length === 1) {
    return 'Unit of measurement was deleted.';
  }

  return `${unitOfMeasurementIds.length} units of measurement were deleted.`;
};

export const useDeleteUnitsOfMeasurement = ({
  onDeleted,
  unitOfMeasurementIds,
}: UseDeleteUnitsOfMeasurementArgs) => {
  const { add: addToast } = useToastManager();

  const deleteUnitsOfMeasurementMutation = useMutation<void, ApiError>({
    mutationFn: async () => {
      const result = await deleteUnitsOfMeasurement({ unitOfMeasurementIds });

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
        description: getSuccessDescription(unitOfMeasurementIds),
        type: 'success',
      });
      await onDeleted();
    },
  });

  return {
    handleDelete: () => deleteUnitsOfMeasurementMutation.mutate(),
    isDeleting: deleteUnitsOfMeasurementMutation.isPending,
  };
};
