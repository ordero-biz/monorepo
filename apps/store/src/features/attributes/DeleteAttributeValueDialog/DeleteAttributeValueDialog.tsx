'use client';

import { Button, Dialog, Typography } from '@ordero/ui';
import type { AttributeValue } from '@/lib/domain/attributes';
import { useDeleteAttributeValue } from './hooks/useDeleteAttributeValue';

type DeleteAttributeValueDialogProps = {
  attributeId: string | number;
  attributeValue: AttributeValue;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export const DeleteAttributeValueDialog = ({
  attributeId,
  attributeValue,
  onOpenChange,
  open,
}: DeleteAttributeValueDialogProps) => {
  const { handleDelete, isDeleting } = useDeleteAttributeValue({
    attributeId,
    attributeValueId: attributeValue.id,
    attributeValueName: attributeValue.name,
    onDeleted: () => onOpenChange(false),
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
                Are you sure you want delete{' '}
                <strong>{attributeValue.name}</strong> attribute value?
              </Typography>
            </Dialog.Content>

            <Dialog.Footer closeDisabled={isDeleting}>
              <Button
                color="error"
                disabled={isDeleting}
                onClick={handleDelete}
                type="button"
              >
                Delete
              </Button>
            </Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
