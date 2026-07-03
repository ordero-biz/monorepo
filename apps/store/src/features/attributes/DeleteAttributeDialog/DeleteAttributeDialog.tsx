'use client';

import { Button, Dialog, Typography } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { clientRoutes } from '@/lib/client/routes';
import type { Attribute } from '@/lib/domain/attributes';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { useDeleteAttribute } from './hooks/useDeleteAttribute';

type DeleteAttributeDialogProps = {
  attribute: Attribute;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export const DeleteAttributeDialog = ({
  attribute,
  onOpenChange,
  open,
}: DeleteAttributeDialogProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { handleDelete, isDeleting } = useDeleteAttribute({
    attributeId: attribute.id,
    attributeName: attribute.name,
    onDeleted: async () => {
      onOpenChange(false);
      queryClient.removeQueries({
        queryKey: attributesQueryKeys.detail(attribute.id),
      });
      queryClient.removeQueries({
        queryKey: attributesQueryKeys.values(attribute.id),
      });
      await queryClient.invalidateQueries({
        queryKey: attributesQueryKeys.list,
      });
      router.push(clientRoutes.attributes);
    },
  });

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup size="xs">
            <Dialog.Header>
              <Dialog.Title>Delete attribute</Dialog.Title>
            </Dialog.Header>

            <Dialog.Content>
              <Typography variant="body1">
                Are you sure you want to delete{' '}
                <strong>{attribute.name}</strong> attribute?
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
