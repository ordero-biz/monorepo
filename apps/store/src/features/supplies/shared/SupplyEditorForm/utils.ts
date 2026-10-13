import type { SupplyEntryData } from '@/lib/client/api/supplies';
import type { SupplyDetails } from '@/lib/domain/supplies/types';
import type { SupplyEntryFormValues, SupplyFormValues } from './types';

export const createEmptySupplyEntry = (
  clientId: string
): SupplyEntryFormValues => ({
  clientId,
  productVariantId: null,
  productVariantName: '',
  productVariantSku: '',
  unitOfMeasurementId: null,
  unitOfMeasurementName: '',
  quantity: '',
  unitPrice: '',
  comment: '',
});

const isBlankSupplyEntry = (entry: SupplyEntryFormValues) =>
  !entry.productVariantId &&
  !entry.unitOfMeasurementId &&
  !entry.quantity.trim() &&
  !entry.unitPrice.trim() &&
  !entry.comment.trim();

const hasPositiveId = (value: string | null) =>
  value !== null && Number.isInteger(Number(value)) && Number(value) > 0;

const isPositiveNumber = (value: string) =>
  value.trim() !== '' && Number.isInteger(Number(value)) && Number(value) > 0;

const isNonnegativeNumber = (value: string) =>
  value.trim() !== '' && Number.isFinite(Number(value)) && Number(value) >= 0;

const isCompleteSupplyEntry = (entry: SupplyEntryFormValues) =>
  hasPositiveId(entry.productVariantId) &&
  hasPositiveId(entry.unitOfMeasurementId) &&
  isPositiveNumber(entry.quantity) &&
  isNonnegativeNumber(entry.unitPrice);

export const getSupplyFormDefaults = (
  initialSupply?: SupplyDetails
): SupplyFormValues => ({
  supplierId: initialSupply ? String(initialSupply.supplier.id) : null,
  supplierName: initialSupply?.supplier.name ?? '',
  warehouseId: initialSupply ? String(initialSupply.warehouse.id) : null,
  warehouseName: initialSupply?.warehouse.name ?? '',
  supplyNumber: initialSupply?.supplyNumber ?? '',
  supplierInvoiceNumber: initialSupply?.supplierInvoiceNumber ?? '',
  comment: initialSupply?.comment ?? '',
  supplyEntries: [
    ...(initialSupply?.supplyEntries.map((entry) => ({
      clientId: `existing-${entry.id}`,
      productVariantId: String(entry.productVariant.id),
      productVariantName: entry.productVariant.name,
      productVariantSku: entry.productVariant.sku ?? '',
      unitOfMeasurementId: String(entry.unitOfMeasurement.id),
      unitOfMeasurementName: entry.unitOfMeasurement.symbol
        ? `${entry.unitOfMeasurement.name} (${entry.unitOfMeasurement.symbol})`
        : entry.unitOfMeasurement.name,
      quantity: String(entry.quantity),
      unitPrice: String(entry.unitPrice),
      comment: entry.comment ?? '',
    })) ?? []),
    createEmptySupplyEntry('initial-placeholder'),
  ],
});

export const validateSupplyForm = (
  value: SupplyFormValues,
  requireEntries: boolean
): { fields: Record<string, string> } | undefined => {
  const fields: Record<string, string> = {};

  if (!hasPositiveId(value.supplierId)) {
    fields.supplierId = 'Select a supplier';
  }

  if (!hasPositiveId(value.warehouseId)) {
    fields.warehouseId = 'Select a warehouse';
  }

  if (!value.supplyNumber.trim()) {
    fields.supplyNumber = 'Supply number is required';
  }

  const filledEntries = value.supplyEntries.filter(
    (entry) => !isBlankSupplyEntry(entry)
  );

  if (requireEntries && filledEntries.length === 0) {
    fields.supplyEntries = 'Add at least one product';
  }

  value.supplyEntries.forEach((entry, index) => {
    if (isBlankSupplyEntry(entry)) {
      return;
    }

    const fieldPath = `supplyEntries[${index}]`;

    if (!hasPositiveId(entry.productVariantId)) {
      fields[`${fieldPath}.productVariantId`] = 'Select a product';
    }

    if (!hasPositiveId(entry.unitOfMeasurementId)) {
      fields[`${fieldPath}.unitOfMeasurementId`] = 'Select a unit';
    }

    if (!isPositiveNumber(entry.quantity)) {
      fields[`${fieldPath}.quantity`] = entry.quantity.trim()
        ? 'Quantity must be a whole number greater than 0'
        : 'Quantity is required';
    }

    if (!isNonnegativeNumber(entry.unitPrice)) {
      fields[`${fieldPath}.unitPrice`] = entry.unitPrice.trim()
        ? 'Unit price must be 0 or greater'
        : 'Unit price is required';
    }
  });

  return Object.keys(fields).length > 0 ? { fields } : undefined;
};

export const getSupplyEntriesPayload = (
  value: SupplyFormValues
): SupplyEntryData[] =>
  value.supplyEntries
    .filter((entry) => !isBlankSupplyEntry(entry))
    .map((entry) => ({
      productVariantId: Number(entry.productVariantId),
      unitOfMeasurementId: Number(entry.unitOfMeasurementId),
      quantity: Number(entry.quantity),
      unitPrice: Number(entry.unitPrice),
      comment: entry.comment.trim() || null,
    }));

export const getSupplyTotal = (
  value: SupplyFormValues
): { count: number; total: number } => {
  const completeEntries = value.supplyEntries.filter(isCompleteSupplyEntry);

  return {
    count: completeEntries.length,
    total: completeEntries.reduce(
      (total, entry) =>
        total + Number(entry.quantity) * Number(entry.unitPrice),
      0
    ),
  };
};
