import { useState } from 'react';
import { WarehousesAsyncCombobox } from '@/features/warehouses/shared/WarehousesAsyncCombobox';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { TransferWarehouseReviewDialog } from '../TransferWarehouseReviewDialog';
import type { TransferWarehouseSelection } from '../types';
import type { TransferWarehouseComboboxProps } from './types';

export const TransferWarehouseCombobox = ({
  onBlur,
  onValueChange,
  ...props
}: TransferWarehouseComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [warehouseToReview, setWarehouseToReview] =
    useState<TransferWarehouseSelection | null>(null);

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
      <TransferWarehouseReviewDialog
        onClose={() => setWarehouseToReview(null)}
        onSelect={onValueChange}
        warehouse={warehouseToReview}
      />
    </>
  );
};
