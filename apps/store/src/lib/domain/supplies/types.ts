import type { SupplierStatus } from '@/lib/domain/suppliers/types';
import type { UnitOfMeasurement } from '@/lib/domain/units-of-measurement/types';
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
  comment: string | null;
  completedAt: string | null;
  completedBy: string | null;
  supplyNumber: string;
  supplierInvoiceNumber: string | null;
  totalPrice: number;
  createdAt: string;
};

export type SupplyProductVariantSummary = {
  id: number;
  name: string;
  sku: string;
  barcode: string;
};

export type SupplyEntry = {
  id: number;
  productVariant: SupplyProductVariantSummary;
  unitOfMeasurement: UnitOfMeasurement;
  quantity: number;
  unitPrice: number;
  comment: string | null;
};

export type SupplyDetails = Supply & {
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  supplyEntries: SupplyEntry[];
  version: number;
};
