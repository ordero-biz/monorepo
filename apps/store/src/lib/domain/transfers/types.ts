import type { UnitOfMeasurement } from '@/lib/domain/units-of-measurement/types';
import type { WarehouseSelection } from '@/lib/domain/warehouses/types';
import type { TRANSFER_STATUS } from './constants';

export type TransferStatus =
  (typeof TRANSFER_STATUS)[keyof typeof TRANSFER_STATUS];

export type TransferProductVariantSummary = {
  id: number;
  name: string;
  sku: string;
  barcode: string;
};

export type TransferEntry = {
  id: number;
  productVariant: TransferProductVariantSummary;
  unitOfMeasurement: UnitOfMeasurement;
  quantity: number;
  comment: string | null;
};

export type TransferDetails = {
  id: number;
  sourceWarehouse: WarehouseSelection;
  destinationWarehouse: WarehouseSelection;
  transferNumber: string;
  status: TransferStatus;
  comment: string | null;
  dispatchedAt: string | null;
  dispatchedBy: string | null;
  completedAt: string | null;
  completedBy: string | null;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  transferEntries: TransferEntry[];
  version: number;
};
