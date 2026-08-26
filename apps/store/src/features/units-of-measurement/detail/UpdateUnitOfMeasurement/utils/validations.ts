import { z } from 'zod';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/unitsOfMeasurement';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';

export const updateUnitOfMeasurementNameSchema = z
  .string()
  .trim()
  .min(1, 'Unit name is required');

export const updateUnitOfMeasurementSymbolSchema = z
  .string()
  .trim()
  .min(1, 'Unit symbol is required');

export const updateUnitOfMeasurementSchema = z.object({
  name: updateUnitOfMeasurementNameSchema,
  status: z.enum(UNIT_OF_MEASUREMENT_STATUS),
  symbol: updateUnitOfMeasurementSymbolSchema,
  comment: z.string(),
});

export type UpdateUnitOfMeasurementFormValues = z.infer<
  typeof updateUnitOfMeasurementSchema
>;

const getValidationMessage = (schema: z.ZodString, value: string) => {
  const result = schema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};

export const validateUpdateUnitOfMeasurementName = ({
  value,
}: ValidationArgs<string>) =>
  getValidationMessage(updateUnitOfMeasurementNameSchema, value);

export const validateUpdateUnitOfMeasurementSymbol = ({
  value,
}: ValidationArgs<string>) =>
  getValidationMessage(updateUnitOfMeasurementSymbolSchema, value);
