'use client';

import { Button, Dialog, Typography } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { useDeleteAttributeValue } from './hooks/useDeleteAttributeValue';
import type { DeleteAttributeValueDialogProps } from './types';

export const DeleteAttributeValueDialog = ({
  attributeId,
  attributeValue,
  onOpenChange,
  open,
}: DeleteAttributeValueDialogProps) => {
  const queryClient = useQueryClient();
  const { handleDelete, isDeleting } = useDeleteAttributeValue({
    attributeValueId: attributeValue.id,
    attributeValueName: attributeValue.name,
    onDeleted: async () => {
      onOpenChange(false);
      await queryClient.invalidateQueries({
        queryKey: attributesQueryKeys.values(attributeId),
      });
    },
  });

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup size="xs">
            <Dialog.Header>
              <Dialog.Title>Delete attribute value</Dialog.Title>
            </Dialog.Header>

            <Dialog.Content>
              <Typography variant="body1">
                Are you sure you want to delete the{' '}
                "<strong>{attributeValue.name}</strong>" attribute value?
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
