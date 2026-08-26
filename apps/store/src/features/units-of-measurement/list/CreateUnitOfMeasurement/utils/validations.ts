import { z } from 'zod';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/unitsOfMeasurement';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';

export const unitOfMeasurementNameSchema = z
  .string()
  .trim()
  .min(1, 'Unit name is required');

export const unitOfMeasurementSymbolSchema = z
  .string()
  .trim()
  .min(1, 'Unit symbol is required');

export const createUnitOfMeasurementSchema = z.object({
  name: unitOfMeasurementNameSchema,
  status: z.enum(UNIT_OF_MEASUREMENT_STATUS),
  symbol: unitOfMeasurementSymbolSchema,
  comment: z.string(),
});

export type CreateUnitOfMeasurementFormValues = z.infer<
  typeof createUnitOfMeasurementSchema
>;

const getValidationMessage = (schema: z.ZodString, value: string) => {
  const result = schema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};

export const validateUnitOfMeasurementName = ({
  value,
}: ValidationArgs<string>) =>
  getValidationMessage(unitOfMeasurementNameSchema, value);

export const validateUnitOfMeasurementSymbol = ({
  value,
}: ValidationArgs<string>) =>
  getValidationMessage(unitOfMeasurementSymbolSchema, value);
