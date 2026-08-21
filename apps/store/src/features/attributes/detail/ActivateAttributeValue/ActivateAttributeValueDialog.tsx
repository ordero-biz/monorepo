'use client';

import { Button, Dialog, Typography } from '@ordero/ui';
import { useActivateAttributeValue } from './hooks/useActivateAttributeValue';
import type { ActivateAttributeValueDialogProps } from './types';

export const ActivateAttributeValueDialog = ({
  attributeId,
  attributeValue,
  onOpenChange,
  onUpdated,
  open,
}: ActivateAttributeValueDialogProps) => {
  const { handleActivate, isActivating } = useActivateAttributeValue({
    attributeId,
    attributeValueId: attributeValue.id,
    attributeValueName: attributeValue.name,
    onActivated: async () => {
      onOpenChange(false);
      await onUpdated();
    },
  });

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup size="xs">
            <Dialog.Header>
              <Dialog.Title>Publish attribute value</Dialog.Title>
            </Dialog.Header>

            <Dialog.Content>
              <div className="flex flex-col gap-[var(--space-2)]">
                <Typography variant="body1">
                  Are you sure you want to publish this attribute value? Once
                  active, it will be fully functional and available for
                  products.
                </Typography>
                <Typography variant="body1">
                  <strong>
                    This action cannot be undone, and the attribute value will
                    no longer be editable.
                  </strong>
                </Typography>
              </div>
            </Dialog.Content>

            <Dialog.Footer
              closeButtonLabel="Cancel"
              closeDisabled={isActivating}
            >
              <Button
                color="primary"
                disabled={isActivating}
                onClick={handleActivate}
                type="button"
              >
                {isActivating ? 'Publishing...' : 'Publish'}
              </Button>
            </Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
