import type { Warehouse } from '@/lib/domain/warehouses';

export type UpdateWarehouseDialogProps = {
  onOpenChange: (open: boolean) => void;
  onUpdated: () => Promise<void> | void;
  open: boolean;
  warehouse: Warehouse;
};

export type UpdateWarehouseDialogTriggerProps = {
  onUpdated: () => Promise<void> | void;
  warehouse: Warehouse;
};
