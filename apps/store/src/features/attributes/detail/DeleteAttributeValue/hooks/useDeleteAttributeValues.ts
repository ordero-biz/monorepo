'use client';

import type { ApiError } from '@ordero/api-types';
import { useToastManager } from '@ordero/ui';
import { useMutation } from '@tanstack/react-query';
import { deleteAttributeValues } from '@/lib/client/api/attributes';

type UseDeleteAttributeValuesArgs = {
  attributeValueIds: number[];
  onDeleted: () => Promise<void> | void;
};

const getSuccessDescription = (attributeValueIds: number[]) => {
  if (attributeValueIds.length === 1) {
    return 'Attribute value was deleted.';
  }

  return `${attributeValueIds.length} attribute values were deleted.`;
};

export const useDeleteAttributeValues = ({
  attributeValueIds,
  onDeleted,
}: UseDeleteAttributeValuesArgs) => {
  const { add: addToast } = useToastManager();

  const deleteAttributeValuesMutation = useMutation<void, ApiError>({
    mutationFn: async () => {
      const result = await deleteAttributeValues({ attributeValueIds });

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
        description: getSuccessDescription(attributeValueIds),
        type: 'success',
      });
      await onDeleted();
    },
  });

  return {
    handleDelete: () => deleteAttributeValuesMutation.mutate(),
    isDeleting: deleteAttributeValuesMutation.isPending,
  };
};
