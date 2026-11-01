import type { ApiError } from '@ordero/api-types';
import { useToastManager } from '@ordero/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAttribute } from '@/lib/client/api/attributes';
import { ATTRIBUTE_STATUS } from '@/lib/domain/attributes/constants';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { getApiErrorMessage } from '@/lib/utils/apiError';

type UseActivateAttributeArgs = {
  attributeId: number;
  attributeName: string;
  onActivated: () => Promise<void> | void;
};

export const useActivateAttribute = ({
  attributeId,
  attributeName,
  onActivated,
}: UseActivateAttributeArgs) => {
  const { add: addToast } = useToastManager();
  const queryClient = useQueryClient();
  const activateAttributeMutation = useMutation<void, ApiError>({
    mutationFn: async () => {
      const result = await updateAttribute({
        attributeId,
        status: ATTRIBUTE_STATUS.ACTIVE,
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
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: attributesQueryKeys.list,
        }),
        queryClient.invalidateQueries({
          queryKey: attributesQueryKeys.detail(attributeId),
        }),
      ]);
      addToast({
        description: `Attribute ${attributeName} was published`,
        type: 'success',
      });

      await onActivated();
    },
  });

  return {
    handleActivate: () => activateAttributeMutation.mutate(),
    isActivating: activateAttributeMutation.isPending,
  };
};
