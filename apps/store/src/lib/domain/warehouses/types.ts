import type { UnitOfMeasurement } from '@/lib/domain/units-of-measurement/types';
import type { WAREHOUSE_STATUS } from './constants';

export type WarehouseStatus =
  (typeof WAREHOUSE_STATUS)[keyof typeof WAREHOUSE_STATUS];

export type Warehouse = {
  id: number;
  name: string;
  address?: string | null;
  comment: string;
  status?: WarehouseStatus;
};

export type WarehouseStockItem = {
  productVariant: {
    id: number;
    name: string;
    sku?: string | null;
    barcode?: string | null;
  };
  unitOfMeasurement: UnitOfMeasurement;
  quantity: number;
  totalPrice: number;
};
