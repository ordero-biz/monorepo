import type { UnitOfMeasurement } from '@/lib/domain/units-of-measurement/types';
import type { SUPPLY_STATUS } from './constants';

export type SupplyStatus = (typeof SUPPLY_STATUS)[keyof typeof SUPPLY_STATUS];

export type SupplyPartySummary = {
  id: number;
  name: string;
  status: string;
};

export type Supply = {
  id: number;
  supplier: SupplyPartySummary;
  warehouse: SupplyPartySummary;
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

export type SupplyProductVariantSummary = {
  id: number;
  name: string;
  sku?: string | null;
  barcode?: string | null;
};

export type SupplyEntry = {
  id: number;
  productVariant: SupplyProductVariantSummary;
  unitOfMeasurement: UnitOfMeasurement;
  quantity: number;
  unitPrice: number;
  comment?: string | null;
};

export type SupplyDetails = Supply & {
  supplyEntries: SupplyEntry[];
  version: number;
};
