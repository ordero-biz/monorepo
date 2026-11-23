'use client';

import { Button, Dialog, Typography } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { transfersQueryKeys } from '@/lib/query/transfers/transfersQueryKeys';
import { useDeleteTransfer } from './hooks/useDeleteTransfer';
import type { DeleteTransferDialogProps } from './types';

export const DeleteTransferDialog = ({
  transfer,
  onDeleted,
  onOpenChange,
  open,
}: DeleteTransferDialogProps) => {
  const queryClient = useQueryClient();

  const { handleDelete, isDeleting } = useDeleteTransfer({
    transferId: transfer.id,
    onDeleted: async () => {
      onOpenChange(false);
      queryClient.removeQueries({
        queryKey: transfersQueryKeys.detail(transfer.id),
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: transfersQueryKeys.list,
        }),
        onDeleted?.(),
      ]);
    },
  });

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup size="xs">
            <Dialog.Header>
              <Dialog.Title>Delete transfer</Dialog.Title>
            </Dialog.Header>

            <Dialog.Content>
              <Typography variant="body1">
                {transfer.transferNumber ? (
                  <>
                    Are you sure you want to delete the "
                    <strong>{transfer.transferNumber}</strong>" transfer?
                  </>
                ) : (
                  'Are you sure you want to delete this transfer?'
                )}
              </Typography>
            </Dialog.Content>

            <Dialog.Footer closeDisabled={isDeleting}>
              <Button
                color="error"
                disabled={isDeleting}
                onClick={handleDelete}
                type="button"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
