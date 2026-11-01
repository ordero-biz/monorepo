import { z } from 'zod';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/units-of-measurement/constants';
import { getValidationMessage } from '@/lib/utils/form/validation/message';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';

export const unitOfMeasurementNameSchema = z
  .string()
  .trim()
  .min(1, 'Unit name is required');

export const unitOfMeasurementSymbolSchema = z.string().trim().optional();

export const unitOfMeasurementCommentSchema = z.string().trim().optional();

export const unitOfMeasurementStatusSchema = z.enum(UNIT_OF_MEASUREMENT_STATUS);

export const validateUnitOfMeasurementName = ({
  value,
}: ValidationArgs<string>) => {
  return getValidationMessage(unitOfMeasurementNameSchema, value);
};

export const validateUnitOfMeasurementStatus = ({
  value,
}: ValidationArgs<z.infer<typeof unitOfMeasurementStatusSchema>>) => {
  return getValidationMessage(unitOfMeasurementStatusSchema, value);
};
