import type { ApiError } from '@ordero/api-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCategory, updateCategory } from '@/lib/client/api/categories';
import { CATEGORY_STATUS } from '@/lib/domain/categories/constants';
import type { Category } from '@/lib/domain/categories/types';
import { categoriesQueryKeys } from '@/lib/query/categories/categoriesQueryKeys';
import { categoryQueryOptions } from '@/lib/query/categories/categoriesQueryOptions';

export const useReviewProductCategory = (categoryId: number) => {
  const queryClient = useQueryClient();

  const categoryQuery = useQuery({
    ...categoryQueryOptions(categoryId, getCategory),
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const activateCategory = useMutation<Category, ApiError>({
    mutationFn: async () => {
      const result = await updateCategory({
        categoryId,
        status: CATEGORY_STATUS.ACTIVE,
      });

      if (!result.ok) {
        throw result.error;
      }

      if (result.data.status !== CATEGORY_STATUS.ACTIVE) {
        throw {
          message:
            'Activation could not be confirmed. Check the category status and try again.',
        };
      }

      return result.data;
    },
    onSuccess: (category) => {
      queryClient.setQueryData(
        categoriesQueryKeys.detail(category.id),
        category
      );

      // Mark related caches stale: lists, dropdowns, and other category details
      // may still show this category as Draft, including as a parent.
      // Active queries refetch now; inactive queries refresh when used again.
      // Exclude this category's exact detail query, already updated above.
      queryClient.invalidateQueries({
        queryKey: ['categories'],
        predicate: (query) =>
          !(
            query.queryKey.length === 3 &&
            query.queryKey[1] === 'detail' &&
            query.queryKey[2] === String(categoryId)
          ),
      });
    },
  });

  return {
    categoryQuery,
    activateCategory,
  };
};
