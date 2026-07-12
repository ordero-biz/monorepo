import type { ApiError } from '@ordero/api-types';
import { useToastManager } from '@ordero/ui';
import { useMutation } from '@tanstack/react-query';
import { deleteAttributeValues } from '@/lib/client/api/attributes';

type UseDeleteAttributeValueArgs = {
  attributeValueId: number;
  attributeValueName: string;
  onDeleted: () => Promise<void> | void;
};

export const useDeleteAttributeValue = ({
  attributeValueId,
  attributeValueName,
  onDeleted,
}: UseDeleteAttributeValueArgs) => {
  const { add: addToast } = useToastManager();

  const deleteAttributeValueMutation = useMutation<void, ApiError>({
    mutationFn: async () => {
      const result = await deleteAttributeValues({
        attributeValueIds: [attributeValueId],
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
      addToast({
        description: `Attribute value ${attributeValueName} was deleted.`,
        type: 'success',
      });
      await onDeleted();
    },
  });

  return {
    handleDelete: () => deleteAttributeValueMutation.mutate(),
    isDeleting: deleteAttributeValueMutation.isPending,
  };
};
