import type { UnitOfMeasurement } from '@/lib/domain/units-of-measurement/types';
import type { UpdateUnitOfMeasurementFormValues } from './validations';

export const getUnitOfMeasurementDefaultValues = (
  unitOfMeasurement: UnitOfMeasurement
): UpdateUnitOfMeasurementFormValues => ({
  comment: unitOfMeasurement.comment ?? undefined,
  name: unitOfMeasurement.name,
  symbol: unitOfMeasurement.symbol ?? undefined,
});
