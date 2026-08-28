import type { Warehouse } from '@/lib/domain/warehouses';

export type WarehouseDetailProps = {
  warehouseId: string;
};

export type WarehouseDetailHeaderProps = {
  onUpdated: () => Promise<void> | void;
  warehouse: Warehouse;
};

export type WarehouseDetailInfoProps = {
  warehouse: Warehouse;
};

export type WarehouseDetailField = {
  label: string;
  value: Warehouse[keyof Warehouse];
};

export type ActivateWarehouseDialogTriggerProps = {
  onUpdated: () => Promise<void> | void;
  warehouse: Warehouse;
};

export type ActivateWarehouseDialogProps = {
  onOpenChange: (open: boolean) => void;
  onUpdated: () => Promise<void> | void;
  open: boolean;
  warehouse: Warehouse;
};
