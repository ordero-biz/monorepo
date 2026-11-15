import { z } from 'zod';
import { getValidationMessage } from '@/lib/utils/form/validation/message';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';
import type { TransferFormValues } from './types';

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
