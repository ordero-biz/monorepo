'use client';

import { Button, Dialog, Typography } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { useDeleteAttributeValues } from './hooks/useDeleteAttributeValues';
import type { DeleteAttributeValuesDialogProps } from './types';

export const DeleteAttributeValuesDialog = ({
  attributeId,
  attributeValues,
  onDeleted,
  onOpenChange,
  open,
}: DeleteAttributeValuesDialogProps) => {
  const queryClient = useQueryClient();
  const isSingleValue = attributeValues.length === 1;
  const { handleDelete, isDeleting } = useDeleteAttributeValues({
    attributeValueIds: attributeValues.map((attributeValue) => attributeValue.id),
    onDeleted: async () => {
      onDeleted?.();
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
              <Dialog.Title>
                {isSingleValue
                  ? 'Delete attribute value'
                  : 'Delete attribute values'}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Content>
              <Typography variant="body1">
                {isSingleValue
                  ? `Are you sure you want to delete the "${attributeValues[0]?.name}" attribute value?`
                  : `Are you sure you want to delete ${attributeValues.length} attribute values?`}
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
