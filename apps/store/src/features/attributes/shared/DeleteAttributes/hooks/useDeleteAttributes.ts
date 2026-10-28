'use client';

import type { ApiError } from '@ordero/api-types';
import { useToastManager } from '@ordero/ui';
import { useMutation } from '@tanstack/react-query';
import { deleteAttributes } from '@/lib/client/api/attributes';

type UseDeleteAttributesArgs = {
  attributeIds: number[];
  onDeleted: () => Promise<void> | void;
};

const getSuccessDescription = (attributeIds: number[]) => {
  if (attributeIds.length === 1) {
    return 'Attribute was deleted.';
  }

  return `${attributeIds.length} attributes were deleted.`;
};

export const useDeleteAttributes = ({
  attributeIds,
  onDeleted,
}: UseDeleteAttributesArgs) => {
  const { add: addToast } = useToastManager();

  const deleteAttributesMutation = useMutation<void, ApiError>({
    mutationFn: async () => {
      const result = await deleteAttributes({ attributeIds });

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
        description: getSuccessDescription(attributeIds),
        type: 'success',
      });
      await onDeleted();
    },
  });

  return {
    handleDelete: () => deleteAttributesMutation.mutate(),
    isDeleting: deleteAttributesMutation.isPending,
  };
};
