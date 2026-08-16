import type { ApiError } from '@ordero/api-types';
import { useToastManager } from '@ordero/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCategory } from '@/lib/client/api/categories';
import { CATEGORY_STATUS } from '@/lib/domain/categories';
import { categoriesQueryKeys } from '@/lib/query/categories/categoriesQueryKeys';

type UseActivateCategoryArgs = {
  categoryId: number;
  categoryName: string;
  onActivated: () => Promise<void> | void;
};

export const useActivateCategory = ({
  categoryId,
  categoryName,
  onActivated,
}: UseActivateCategoryArgs) => {
  const { add: addToast } = useToastManager();
  const queryClient = useQueryClient();

  const activateCategoryMutation = useMutation<void, ApiError>({
    mutationFn: async () => {
      const result = await updateCategory({
        categoryId,
        status: CATEGORY_STATUS.ACTIVE,
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
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: categoriesQueryKeys.list,
        }),
        queryClient.invalidateQueries({
          queryKey: categoriesQueryKeys.detail(categoryId),
        }),
      ]);
      addToast({
        description: `Category ${categoryName} was published`,
        type: 'success',
      });

      await onActivated();
    },
  });

  return {
    handleActivate: () => activateCategoryMutation.mutate(),
    isActivating: activateCategoryMutation.isPending,
  };
};
