import type { ApiError } from '@ordero/api-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAttribute,
  getAttributeValues,
  updateAttributeValue,
} from '@/lib/client/api/attributes';
import { ATTRIBUTE_VALUE_STATUS } from '@/lib/domain/attributes/constants';
import type { AttributeValue } from '@/lib/domain/attributes/types';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import {
  attributeQueryOptions,
  attributeValuesQueryOptions,
} from '@/lib/query/attributes/attributesQueryOptions';

export const useReviewProductAttributeValue = (
  attributeId: number,
  attributeValueId: number
) => {
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

  const activateAttributeValue = useMutation<AttributeValue, ApiError>({
    mutationFn: async () => {
      const result = await updateAttributeValue({
        attributeValueId,
        status: ATTRIBUTE_VALUE_STATUS.ACTIVE,
      });

      if (!result.ok) {
        throw result.error;
      }

      if (result.data.status !== ATTRIBUTE_VALUE_STATUS.ACTIVE) {
        throw {
          message:
            'Activation could not be confirmed. Check the value status and try again.',
        };
      }

      return result.data;
    },
    onSuccess: (attributeValue) => {
      queryClient.setQueryData<AttributeValue[]>(
        attributesQueryKeys.values(attributeId),
        (values) =>
          values?.map((value) =>
            value.id === attributeValue.id ? attributeValue : value
          )
      );

      // Attribute lists and dropdowns can contain nested values with stale status.
      // Active queries refetch now; inactive queries refresh when used again.
      // Refresh the parent details too, but retain the values updated above.
      queryClient.invalidateQueries({ queryKey: attributesQueryKeys.list });
      queryClient.invalidateQueries({
        queryKey: attributesQueryKeys.detail(attributeId),
        exact: true,
      });
    },
  });

  return {
    attributeQuery,
    attributeValuesQuery,
    activateAttributeValue,
  };
};
