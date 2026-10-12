import type { SupplierStatus } from '@/lib/domain/suppliers/types';
import type { WarehouseStatus } from '@/lib/domain/warehouses/types';
import type { SUPPLY_STATUS } from './constants';

export type SupplyStatus = (typeof SUPPLY_STATUS)[keyof typeof SUPPLY_STATUS];

type SupplyWarehouseData = {
  id: number;
  name: string;
  status: WarehouseStatus;
};

type SupplySupplierData = {
  id: number;
  name: string;
  status: SupplierStatus;
};

export type Supply = {
  id: number;
  supplier: SupplySupplierData;
  warehouse: SupplyWarehouseData;
  status: SupplyStatus;
  comment?: string | null;
  completedAt?: string | null;
  completedBy?: string | null;
  supplyNumber?: string | null;
  supplierInvoiceNumber?: string | null;
  totalQuantity: number;
  totalPrice: number;
  createdAt?: string | null;
};
