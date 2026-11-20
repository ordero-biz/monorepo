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

export type Transfer = {
  id: number;
  sourceWarehouse: WarehouseSelection;
  destinationWarehouse: WarehouseSelection;
  transferNumber: string;
  status: TransferStatus;
  comment: string | null;
  dispatchedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  version: number;
};

export type TransferDetails = Transfer & {
  dispatchedBy: string | null;
  completedBy: string | null;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  transferEntries: TransferEntry[];
};
