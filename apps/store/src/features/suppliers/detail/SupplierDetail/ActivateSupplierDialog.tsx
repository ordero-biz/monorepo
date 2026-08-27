'use client';

import { Button, Dialog, Typography } from '@ordero/ui';
import { useActivateSupplier } from './hooks/useActivateSupplier';
import type { SupplierDetailHeaderProps } from './types';

type ActivateSupplierDialogProps = SupplierDetailHeaderProps & {
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export const ActivateSupplierDialog = ({
  supplier,
  onOpenChange,
  onUpdated,
  open,
}: ActivateSupplierDialogProps) => {
  const { handleActivate, isActivating } = useActivateSupplier({
    onActivated: async () => {
      onOpenChange(false);
      await onUpdated();
    },
    supplierId: supplier.id,
    supplierName: supplier.name,
  });

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup size="xs">
            <Dialog.Header>
              <Dialog.Title>Publish supplier</Dialog.Title>
            </Dialog.Header>
            <Dialog.Content>
              <div className="flex flex-col gap-[var(--space-2)]">
                <Typography variant="body1">
                  Are you sure you want to publish this supplier? Once active,
                  it will be fully functional.
                </Typography>
                <Typography variant="body1">
                  <strong>
                    This action cannot be undone. However, you will still be
                    able to update contact details and comments.
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
