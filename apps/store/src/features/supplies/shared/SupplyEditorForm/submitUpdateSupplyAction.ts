import {
  type SupplyEntryData,
  type UpdateSupplyData,
  type UpdateSupplyFieldData,
  updateSupply,
} from '@/lib/client/api/supplies';
import type { SupplyDetails, SupplyStatus } from '@/lib/domain/supplies/types';
import type { SupplyFormValues } from './types';
import { getSupplyEntriesPayload, normalizeOptionalText } from './utils';

type SubmitUpdateSupplyActionArgs = {
  value: SupplyFormValues;
  initialSupply: SupplyDetails;
  status: SupplyStatus;
};

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

export const getUpdateSupplyData = ({
  value,
  initialSupply,
  status,
}: SubmitUpdateSupplyActionArgs): UpdateSupplyData | null => {
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

export const submitUpdateSupplyAction = async (
  args: SubmitUpdateSupplyActionArgs
) => {
  const data = getUpdateSupplyData(args);
  if (!data) {
    return null;
  }

  return updateSupply(data);
};
