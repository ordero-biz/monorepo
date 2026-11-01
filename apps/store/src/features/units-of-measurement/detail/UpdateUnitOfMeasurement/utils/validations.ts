import { z } from 'zod';
import {
  unitOfMeasurementCommentSchema,
  unitOfMeasurementNameSchema,
  unitOfMeasurementSymbolSchema,
} from '../../../shared/validations';

export const updateUnitOfMeasurementSchema = z.object({
  name: unitOfMeasurementNameSchema,
  symbol: unitOfMeasurementSymbolSchema,
  comment: unitOfMeasurementCommentSchema,
});

export type UpdateUnitOfMeasurementFormValues = z.infer<
  typeof updateUnitOfMeasurementSchema
>;
