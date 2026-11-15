import { Dialog } from '@ordero/ui';
import { useState } from 'react';
import { ReviewTransferWarehouse } from './ReviewTransferWarehouse';
import type { TransferWarehouseReviewDialogProps } from './types';

export const TransferWarehouseReviewDialog = ({
  onClose,
  onSelect,
  warehouse,
}: TransferWarehouseReviewDialogProps) => {
  const [isPublishing, setIsPublishing] = useState(false);

  return (
    <Dialog.Root
      open={warehouse !== null}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !isPublishing) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup size="xs">
            {warehouse ? (
              <ReviewTransferWarehouse
                key={warehouse.id}
                onBusyChange={setIsPublishing}
                onSelect={(selectedWarehouse) => {
                  onSelect(selectedWarehouse);
                  onClose();
                }}
                warehouse={warehouse}
              />
            ) : null}
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
