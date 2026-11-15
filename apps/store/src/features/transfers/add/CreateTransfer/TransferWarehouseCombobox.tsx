import { Dialog } from '@ordero/ui';
import { useState } from 'react';
import { WarehousesAsyncCombobox } from '@/features/warehouses/shared/WarehousesAsyncCombobox';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { ReviewTransferWarehouse } from './ReviewTransferWarehouse';
import type {
  TransferWarehouseComboboxProps,
  TransferWarehouseSelection,
} from './types';

export const TransferWarehouseCombobox = ({
  onBlur,
  onValueChange,
  ...props
}: TransferWarehouseComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [warehouseToReview, setWarehouseToReview] =
    useState<TransferWarehouseSelection | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const closeReview = () => {
    setWarehouseToReview(null);
  };

  return (
    <>
      <WarehousesAsyncCombobox
        {...props}
        onBlur={(event) => {
          if (!warehouseToReview) onBlur?.(event);
        }}
        onOpenChange={setOpen}
        onValueChange={(warehouse, details) => {
          if (warehouse && warehouse.status !== WAREHOUSE_STATUS.ACTIVE) {
            details.cancel();
            setOpen(false);
            setWarehouseToReview(warehouse);
            return;
          }
          onValueChange(warehouse);
        }}
        open={open}
      />
      <Dialog.Root
        open={Boolean(warehouseToReview)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen && !isPublishing) closeReview();
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup size="xs">
              {warehouseToReview ? (
                <ReviewTransferWarehouse
                  key={warehouseToReview.id}
                  onBusyChange={setIsPublishing}
                  onSelect={(warehouse) => {
                    onValueChange(warehouse);
                    closeReview();
                  }}
                  warehouse={warehouseToReview}
                />
              ) : null}
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
