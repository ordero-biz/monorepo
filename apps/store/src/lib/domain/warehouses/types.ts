import type { UnitOfMeasurement } from '@/lib/domain/units-of-measurement/types';
import type { WAREHOUSE_STATUS } from './constants';

export type WarehouseStatus =
  (typeof WAREHOUSE_STATUS)[keyof typeof WAREHOUSE_STATUS];

export type Warehouse = {
  id: number;
  name: string;
  address: string | null;
  comment: string;
  phone: string | null;
  status: WarehouseStatus;
  totalItemQuantity: number;
  totalPrice: number;
};

export type WarehouseStockItem = {
  productVariant: {
    id: number;
    name: string;
    sku: string;
    barcode: string;
  };
  unitOfMeasurement: UnitOfMeasurement;
  quantity: number;
  totalPrice: number;
};
