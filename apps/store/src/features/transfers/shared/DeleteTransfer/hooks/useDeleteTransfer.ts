'use client';

import type { ApiError } from '@ordero/api-types';
import { useToastManager } from '@ordero/ui';
import { useMutation } from '@tanstack/react-query';
import { deleteTransfer } from '@/lib/client/api/transfers';

type UseDeleteTransferArgs = {
  transferId: number;
  onDeleted: () => Promise<void> | void;
};

export const useDeleteTransfer = ({
  transferId,
  onDeleted,
}: UseDeleteTransferArgs) => {
  const { add: addToast } = useToastManager();

  const deleteTransferMutation = useMutation<void, ApiError>({
    mutationFn: async () => {
      const result = await deleteTransfer(transferId);

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
        description: 'Transfer was deleted.',
        type: 'success',
      });
      await onDeleted();
    },
  });

  return {
    handleDelete: () => deleteTransferMutation.mutate(),
    isDeleting: deleteTransferMutation.isPending,
  };
};
