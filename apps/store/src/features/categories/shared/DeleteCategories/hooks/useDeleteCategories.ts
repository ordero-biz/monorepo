'use client';

import type { ApiError } from '@ordero/api-types';
import { useToastManager } from '@ordero/ui';
import { useMutation } from '@tanstack/react-query';
import { deleteCategories } from '@/lib/client/api/categories';

type UseDeleteCategoriesArgs = {
  categoryIds: number[];
  onDeleted: () => Promise<void> | void;
};

const getSuccessDescription = (categoryIds: number[]) => {
  if (categoryIds.length === 1) {
    return 'Category was deleted.';
  }

  return `${categoryIds.length} categories were deleted.`;
};

export const useDeleteCategories = ({
  categoryIds,
  onDeleted,
}: UseDeleteCategoriesArgs) => {
  const { add: addToast } = useToastManager();

  const deleteCategoriesMutation = useMutation<void, ApiError>({
    mutationFn: async () => {
      const result = await deleteCategories({ categoryIds });

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
        description: getSuccessDescription(categoryIds),
        type: 'success',
      });
      await onDeleted();
    },
  });

  return {
    handleDelete: () => deleteCategoriesMutation.mutate(),
    isDeleting: deleteCategoriesMutation.isPending,
  };
};
