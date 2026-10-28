import type { Warehouse } from '@/lib/domain/warehouses/types';
import type { PaginationSearchInput } from '@/lib/utils/url';

export type WarehouseDetailProps = {
  warehouseId: string;
  paginationInput?: PaginationSearchInput;
};

export type WarehouseDetailProductsProps = {
  warehouseId: string;
  paginationInput?: PaginationSearchInput;
};

export type WarehouseDetailHeaderProps = {
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
  warehouse: Warehouse;
};

export type ActivateWarehouseDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  warehouse: Warehouse;
};
