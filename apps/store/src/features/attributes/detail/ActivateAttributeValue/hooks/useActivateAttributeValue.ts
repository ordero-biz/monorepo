import type { ApiError } from '@ordero/api-types';
import { useToastManager } from '@ordero/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAttributeValue } from '@/lib/client/api/attributes';
import { ATTRIBUTE_VALUE_STATUS } from '@/lib/domain/attributes/constants';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { getApiErrorMessage } from '@/lib/utils/apiError';

type UseActivateAttributeValueArgs = {
  attributeId: string | number;
  attributeValueId: number;
  attributeValueName: string;
  onActivated: () => Promise<void> | void;
};

export const useActivateAttributeValue = ({
  attributeId,
  attributeValueId,
  attributeValueName,
  onActivated,
}: UseActivateAttributeValueArgs) => {
  const { add: addToast } = useToastManager();
  const queryClient = useQueryClient();
  const activateAttributeValueMutation = useMutation<void, ApiError>({
    mutationFn: async () => {
      const result = await updateAttributeValue({
        attributeValueId,
        status: ATTRIBUTE_VALUE_STATUS.ACTIVE,
      });

      if (!result.ok) {
        throw result.error;
      }
    },
    onError: (error) => {
      addToast({
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: attributesQueryKeys.values(attributeId),
      });
      addToast({
        description: `Attribute value ${attributeValueName} was published`,
        type: 'success',
      });

      await onActivated();
    },
  });

  return {
    handleActivate: () => activateAttributeValueMutation.mutate(),
    isActivating: activateAttributeValueMutation.isPending,
  };
};
