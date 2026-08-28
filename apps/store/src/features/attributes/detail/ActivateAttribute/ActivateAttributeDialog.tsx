'use client';

import { Button, Dialog, Typography } from '@ordero/ui';
import { useActivateAttribute } from './hooks/useActivateAttribute';
import type { ActivateAttributeDialogProps } from './types';

export const ActivateAttributeDialog = ({
  attribute,
  onOpenChange,
  onUpdated,
  open,
}: ActivateAttributeDialogProps) => {
  const { handleActivate, isActivating } = useActivateAttribute({
    attributeId: attribute.id,
    attributeName: attribute.name,
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
              <Dialog.Title>Publish attribute</Dialog.Title>
            </Dialog.Header>

            <Dialog.Content>
              <div className="flex flex-col gap-[var(--space-2)]">
                <Typography variant="body1">
                  Are you sure you want to publish this attribute? Once active,
                  it will be fully functional, available for products, and
                  tracked in analytics.
                </Typography>
                <Typography variant="body1">
                  <strong>
                    This action cannot be undone. Once active, the attribute
                    name cannot be edited, but you can still add and manage
                    values.
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
