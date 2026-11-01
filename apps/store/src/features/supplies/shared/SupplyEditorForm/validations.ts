import { z } from 'zod';
import { getValidationMessage } from '@/lib/utils/form/validation/message';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';
import type { SupplyEntryFormValues, SupplyFormValues } from './types';
import { isBlankSupplyEntry } from './utils';

const createSelectionSchema = (message: string) =>
  z
    .object({ id: z.number({ error: message }).int(message).positive(message) })
    .nullable()
    .refine((value) => value !== null, message);

export const supplySupplierSchema = createSelectionSchema('Select a supplier');
export const supplyWarehouseSchema =
  createSelectionSchema('Select a warehouse');
export const supplyNumberSchema = z
  .string()
  .trim()
  .min(1, 'Supply number is required');

export const supplyEntrySchema = z.object({
  productVariant: createSelectionSchema('Select a product'),
  unitOfMeasurement: createSelectionSchema('Select a unit'),
  quantity: z
    .string()
    .trim()
    .min(1, 'Quantity is required')
    .refine(
      (value) => Number.isInteger(Number(value)) && Number(value) > 0,
      'Quantity must be a whole number greater than 0'
    ),
  unitPrice: z
    .string()
    .trim()
    .min(1, 'Unit price is required')
    .refine(
      (value) => Number.isFinite(Number(value)) && Number(value) >= 0,
      'Unit price must be 0 or greater'
    ),
});

export const validateSupplySupplier = ({
  value,
}: ValidationArgs<SupplyFormValues['supplier']>) =>
  getValidationMessage(supplySupplierSchema, value);

export const validateSupplyWarehouse = ({
  value,
}: ValidationArgs<SupplyFormValues['warehouse']>) =>
  getValidationMessage(supplyWarehouseSchema, value);

export const validateSupplyNumber = ({ value }: ValidationArgs<string>) =>
  getValidationMessage(supplyNumberSchema, value);

export type SupplyEntryValidatedField = keyof typeof supplyEntrySchema.shape;

type ValidateSupplyEntryFieldArgs = ValidationArgs<SupplyEntryFormValues> & {
  field: SupplyEntryValidatedField;
};

export const validateSupplyEntryField = ({
  value,
  field,
}: ValidateSupplyEntryFieldArgs) =>
  isBlankSupplyEntry(value)
    ? undefined
    : getValidationMessage(supplyEntrySchema.shape[field], value[field]);
