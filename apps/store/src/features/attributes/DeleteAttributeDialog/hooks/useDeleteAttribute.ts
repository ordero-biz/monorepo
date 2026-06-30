import type { ApiError } from '@ordero/api-types';
import { useToastManager } from '@ordero/ui';
import { useMutation } from '@tanstack/react-query';
import { deleteAttributes } from '@/lib/client/api/attributes';

type UseDeleteAttributeArgs = {
  attributeId: number;
  attributeName: string;
  onDeleted: () => Promise<void> | void;
};

export const useDeleteAttribute = ({
  attributeId,
  attributeName,
  onDeleted,
}: UseDeleteAttributeArgs) => {
  const { add: addToast } = useToastManager();

  const deleteAttributeMutation = useMutation<void, ApiError>({
    mutationFn: async () => {
      const result = await deleteAttributes({
        attributeIds: [attributeId],
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
        description: `Attribute ${attributeName} was deleted.`,
        type: 'success',
      });
      await onDeleted();
    },
  });

  return {
    handleDelete: () => deleteAttributeMutation.mutate(),
    isDeleting: deleteAttributeMutation.isPending,
  };
};
