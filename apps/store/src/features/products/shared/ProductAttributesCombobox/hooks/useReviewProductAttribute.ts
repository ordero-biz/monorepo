import type { ApiError } from '@ordero/api-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAttribute,
  getAttributeValues,
  updateAttribute,
} from '@/lib/client/api/attributes';
import { ATTRIBUTE_STATUS } from '@/lib/domain/attributes/constants';
import type { Attribute } from '@/lib/domain/attributes/types';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import {
  attributeQueryOptions,
  attributeValuesQueryOptions,
} from '@/lib/query/attributes/attributesQueryOptions';

export const useReviewProductAttribute = (attributeId: number) => {
  const queryClient = useQueryClient();

  const attributeQuery = useQuery({
    ...attributeQueryOptions(attributeId, getAttribute),
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const attributeValuesQuery = useQuery({
    ...attributeValuesQueryOptions(attributeId, getAttributeValues),
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const activateAttribute = useMutation<Attribute, ApiError>({
    mutationFn: async () => {
      const result = await updateAttribute({
        attributeId,
        status: ATTRIBUTE_STATUS.ACTIVE,
      });

      if (!result.ok) {
        throw result.error;
      }

      if (result.data.status !== ATTRIBUTE_STATUS.ACTIVE) {
        throw {
          message:
            'Activation could not be confirmed. Check the attribute status and try again.',
        };
      }

      return result.data;
    },
    onSuccess: (attribute) => {
      queryClient.setQueryData(
        attributesQueryKeys.detail(attribute.id),
        attribute
      );

      // Mark related caches stale so lists, dropdowns, and value collections
      // refresh after activation instead of reusing pre-activation data.
      // Active queries refetch now; inactive queries refresh when used again.
      // Exclude this attribute's exact detail query, already updated above.
      queryClient.invalidateQueries({
        queryKey: ['attributes'],
        predicate: (query) =>
          !(
            query.queryKey.length === 3 &&
            query.queryKey[1] === 'detail' &&
            query.queryKey[2] === String(attributeId)
          ),
      });
    },
  });

  return {
    attributeQuery,
    attributeValuesQuery,
    activateAttribute,
  };
};
