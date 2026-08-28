'use client';

import { Button, Dialog, Typography } from '@ordero/ui';
import { useActivateWarehouse } from './hooks/useActivateWarehouse';
import type { ActivateWarehouseDialogProps } from './types';

export const ActivateWarehouseDialog = ({
  onOpenChange,
  onUpdated,
  open,
  warehouse,
}: ActivateWarehouseDialogProps) => {
  const { handleActivate, isActivating } = useActivateWarehouse({
    warehouseId: warehouse.id,
    warehouseName: warehouse.name,
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
              <Dialog.Title>Publish warehouse</Dialog.Title>
            </Dialog.Header>
            <Dialog.Content>
              <div className="flex flex-col gap-[var(--space-2)]">
                <Typography variant="body1">
                  Are you sure you want to publish this warehouse? Once active,
                  it will be fully functional.
                </Typography>
                <Typography variant="body1">
                  <strong>
                    This action cannot be undone. However, you will still be
                    able to update address and comments.
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
