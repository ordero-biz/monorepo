import type { SupplyEntryData } from '@/lib/client/api/supplies';
import type { SupplyDetails } from '@/lib/domain/supplies/types';
import type { SupplyEntryFormValues, SupplyFormValues } from './types';

export const normalizeOptionalText = (value?: string | null) =>
  value?.trim() || null;

export const createEmptySupplyEntry = (
  clientId: string
): SupplyEntryFormValues => ({
  clientId,
  productVariant: null,
  unitOfMeasurement: null,
  quantity: '',
  unitPrice: '',
  comment: '',
});

const isBlankSupplyEntry = (entry: SupplyEntryFormValues) =>
  !entry.productVariant &&
  !entry.unitOfMeasurement &&
  !entry.quantity.trim() &&
  !entry.unitPrice.trim() &&
  !entry.comment.trim();

const hasPositiveId = (value: string | number | null) =>
  value !== null && Number.isInteger(Number(value)) && Number(value) > 0;

const isPositiveNumber = (value: string) =>
  value.trim() !== '' && Number.isInteger(Number(value)) && Number(value) > 0;

const isNonnegativeNumber = (value: string) =>
  value.trim() !== '' && Number.isFinite(Number(value)) && Number(value) >= 0;

const isCompleteSupplyEntry = (entry: SupplyEntryFormValues) =>
  hasPositiveId(entry.productVariant?.id ?? null) &&
  hasPositiveId(entry.unitOfMeasurement?.id ?? null) &&
  isPositiveNumber(entry.quantity) &&
  isNonnegativeNumber(entry.unitPrice);

export const getSupplyFormDefaults = (
  initialSupply?: SupplyDetails
): SupplyFormValues => ({
  supplier: initialSupply
    ? {
        id: initialSupply.supplier.id,
        name: initialSupply.supplier.name,
        status: initialSupply.supplier.status,
      }
    : null,
  warehouse: initialSupply
    ? {
        id: initialSupply.warehouse.id,
        name: initialSupply.warehouse.name,
        status: initialSupply.warehouse.status,
      }
    : null,
  supplyNumber: initialSupply?.supplyNumber ?? '',
  supplierInvoiceNumber: initialSupply?.supplierInvoiceNumber ?? '',
  comment: initialSupply?.comment ?? '',
  supplyEntries: [
    ...(initialSupply?.supplyEntries.map((entry) => ({
      clientId: `existing-${entry.id}`,
      productVariant: {
        id: entry.productVariant.id,
        name: entry.productVariant.name,
        sku: entry.productVariant.sku ?? '',
      },
      unitOfMeasurement: {
        id: entry.unitOfMeasurement.id,
        name: entry.unitOfMeasurement.name,
        symbol: entry.unitOfMeasurement.symbol,
        status: entry.unitOfMeasurement.status,
      },
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

  if (!hasPositiveId(value.supplier?.id ?? null)) {
    fields.supplier = 'Select a supplier';
  }

  if (!hasPositiveId(value.warehouse?.id ?? null)) {
    fields.warehouse = 'Select a warehouse';
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

    if (!hasPositiveId(entry.productVariant?.id ?? null)) {
      fields[`${fieldPath}.productVariant`] = 'Select a product';
    }

    if (!hasPositiveId(entry.unitOfMeasurement?.id ?? null)) {
      fields[`${fieldPath}.unitOfMeasurement`] = 'Select a unit';
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
      productVariantId: Number(entry.productVariant?.id),
      unitOfMeasurementId: Number(entry.unitOfMeasurement?.id),
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
