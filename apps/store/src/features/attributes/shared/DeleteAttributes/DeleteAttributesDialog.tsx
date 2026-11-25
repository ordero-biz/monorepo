'use client';

import { Button, Dialog, Typography } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { useDeleteAttributes } from './hooks/useDeleteAttributes';
import type { DeleteAttributesDialogProps } from './types';

export const DeleteAttributesDialog = ({
  attributes,
  onDeleted,
  onOpenChange,
  open,
}: DeleteAttributesDialogProps) => {
  const queryClient = useQueryClient();
  const isSingleAttribute = attributes.length === 1;

  const { handleDelete, isDeleting } = useDeleteAttributes({
    attributeIds: attributes.map((attribute) => attribute.id),
    onDeleted: async () => {
      onOpenChange(false);
      attributes.forEach((attribute) => {
        queryClient.removeQueries({
          queryKey: attributesQueryKeys.detail(attribute.id),
        });
      });
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: attributesQueryKeys.list,
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
              <Dialog.Title>
                {isSingleAttribute ? 'Delete attribute' : 'Delete attributes'}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Content>
              <Typography variant="body1">
                {isSingleAttribute ? (
                  <>
                    Are you sure you want to delete the "
                    <strong>{attributes[0]?.name}</strong>" attribute and all
                    its associated values?
                  </>
                ) : (
                  <>
                    Are you sure you want to delete {attributes.length}{' '}
                    attributes and all their associated values?
                  </>
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
