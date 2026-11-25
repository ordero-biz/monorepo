import { z } from 'zod';
import {
  unitOfMeasurementCommentSchema,
  unitOfMeasurementNameSchema,
  unitOfMeasurementStatusSchema,
  unitOfMeasurementSymbolSchema,
} from '../../../shared/validations';

export const createUnitOfMeasurementSchema = z.object({
  name: unitOfMeasurementNameSchema,
  status: unitOfMeasurementStatusSchema,
  symbol: unitOfMeasurementSymbolSchema,
  comment: unitOfMeasurementCommentSchema,
});

export type CreateUnitOfMeasurementFormValues = z.infer<
  typeof createUnitOfMeasurementSchema
>;
