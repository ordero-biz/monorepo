import type {
  CreateSupplyData,
  SupplyEntryData,
  UpdateSupplyData,
  UpdateSupplyFieldData,
} from '@/lib/client/api/supplies';
import type { SupplyDetails, SupplyStatus } from '@/lib/domain/supplies/types';
import type { SupplyFormValues } from './types';
import { getSupplyEntriesPayload } from './utils';

const normalizeOptionalText = (value?: string | null) => value?.trim() || null;

const getInitialSupplyEntries = (supply: SupplyDetails): SupplyEntryData[] =>
  supply.supplyEntries.map((entry) => ({
    productVariantId: entry.productVariant.id,
    unitOfMeasurementId: entry.unitOfMeasurement.id,
    quantity: entry.quantity,
    unitPrice: entry.unitPrice,
    comment: normalizeOptionalText(entry.comment),
  }));

const areSupplyEntriesEqual = (
  left: SupplyEntryData[],
  right: SupplyEntryData[]
) =>
  left.length === right.length &&
  left.every(
    (entry, index) =>
      entry.productVariantId === right[index]?.productVariantId &&
      entry.unitOfMeasurementId === right[index]?.unitOfMeasurementId &&
      entry.quantity === right[index]?.quantity &&
      entry.unitPrice === right[index]?.unitPrice &&
      normalizeOptionalText(entry.comment) ===
        normalizeOptionalText(right[index]?.comment)
  );

export const getCreateSupplyData = (
  value: SupplyFormValues,
  status: SupplyStatus
): CreateSupplyData => {
  const supplierInvoiceNumber = normalizeOptionalText(
    value.supplierInvoiceNumber
  );
  const comment = normalizeOptionalText(value.comment);
  const supplyEntries = getSupplyEntriesPayload(value).map(
    ({ comment: entryComment, ...entry }) =>
      entryComment ? { ...entry, comment: entryComment } : entry
  );

  return {
    supplierId: Number(value.supplierId),
    warehouseId: Number(value.warehouseId),
    supplyNumber: value.supplyNumber.trim(),
    status,
    supplyEntries,
    ...(supplierInvoiceNumber ? { supplierInvoiceNumber } : {}),
    ...(comment ? { comment } : {}),
  };
};

export const getUpdateSupplyData = (
  value: SupplyFormValues,
  initialSupply: SupplyDetails,
  status: SupplyStatus
): UpdateSupplyData | null => {
  const changes: UpdateSupplyFieldData = {};
  const supplierId = Number(value.supplierId);
  const warehouseId = Number(value.warehouseId);
  const supplyNumber = value.supplyNumber.trim();
  const supplierInvoiceNumber = normalizeOptionalText(
    value.supplierInvoiceNumber
  );
  const comment = normalizeOptionalText(value.comment);
  const supplyEntries = getSupplyEntriesPayload(value);

  if (supplierId !== initialSupply.supplier.id) {
    changes.supplierId = supplierId;
  }
  if (warehouseId !== initialSupply.warehouse.id) {
    changes.warehouseId = warehouseId;
  }
  if (supplyNumber !== initialSupply.supplyNumber?.trim()) {
    changes.supplyNumber = supplyNumber;
  }
  if (
    supplierInvoiceNumber !==
    normalizeOptionalText(initialSupply.supplierInvoiceNumber)
  ) {
    changes.supplierInvoiceNumber = supplierInvoiceNumber;
  }
  if (comment !== normalizeOptionalText(initialSupply.comment)) {
    changes.comment = comment;
  }
  if (
    !areSupplyEntriesEqual(
      supplyEntries,
      getInitialSupplyEntries(initialSupply)
    )
  ) {
    changes.supplyEntries = supplyEntries;
  }
  if (status !== initialSupply.status) {
    changes.status = status;
  }

  if (Object.keys(changes).length === 0) {
    return null;
  }

  return {
    supplyId: initialSupply.id,
    expectedVersion: initialSupply.version,
    ...changes,
  };
};
