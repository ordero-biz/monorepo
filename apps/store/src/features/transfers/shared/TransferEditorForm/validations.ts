import { z } from 'zod';
import { getValidationMessage } from '@/lib/utils/form/validation/message';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';
import type { TransferEntryFormValues, TransferFormValues } from './types';
import { isBlankTransferEntry } from './utils/entries';

const createSelectionSchema = (message: string) =>
  z
    .object({ id: z.number({ error: message }).int(message).positive(message) })
    .nullable()
    .refine((value) => value !== null, message);

export const transferNumberSchema = z
  .string()
  .trim()
  .min(1, 'Name is required')
  .max(100, 'Name must be 100 characters or less');
export const transferSourceWarehouseSchema = createSelectionSchema(
  'Select a source warehouse'
);
export const transferDestinationWarehouseSchema = createSelectionSchema(
  'Select a destination warehouse'
);

export const validateTransferNumber = ({ value }: ValidationArgs<string>) =>
  getValidationMessage(transferNumberSchema, value);

export const validateTransferSourceWarehouse = ({
  value,
}: ValidationArgs<TransferFormValues['sourceWarehouse']>) =>
  getValidationMessage(transferSourceWarehouseSchema, value);

type ValidateTransferDestinationWarehouseArgs = ValidationArgs<
  TransferFormValues['destinationWarehouse']
> & {
  sourceWarehouse: TransferFormValues['sourceWarehouse'];
};

export const validateTransferDestinationWarehouse = ({
  value,
  sourceWarehouse,
}: ValidateTransferDestinationWarehouseArgs) => {
  const message = getValidationMessage(
    transferDestinationWarehouseSchema,
    value
  );

  if (message) {
    return message;
  }

  return value && sourceWarehouse && value.id === sourceWarehouse.id
    ? 'Destination must differ from the source warehouse'
    : undefined;
};

export const transferEntryQuantitySchema = z
  .number({ error: 'Quantity is required' })
  .optional()
  .refine((value) => value !== undefined, 'Quantity is required')
  .refine(
    (value) => value === undefined || (Number.isInteger(value) && value > 0),
    'Quantity must be a whole number greater than 0'
  );

export type TransferEntryValidatedField = 'stockItem' | 'quantity';

type ValidateTransferEntryFieldArgs =
  ValidationArgs<TransferEntryFormValues> & {
    field: TransferEntryValidatedField;
  };

export const validateTransferEntryField = ({
  value,
  field,
}: ValidateTransferEntryFieldArgs) => {
  // A fully empty row is the placeholder for the next product and is skipped.
  if (isBlankTransferEntry(value)) {
    return undefined;
  }

  if (field === 'stockItem') {
    return value.stockItem ? undefined : 'Select a product';
  }

  const message = getValidationMessage(
    transferEntryQuantitySchema,
    value.quantity
  );
  if (message) {
    return message;
  }

  const available = value.stockItem?.available;
  return available !== undefined && (value.quantity ?? 0) > available
    ? `Only ${available} available`
    : undefined;
};
