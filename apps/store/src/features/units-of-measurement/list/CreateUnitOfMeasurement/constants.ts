import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/unitsOfMeasurement';
import type { CreateUnitOfMeasurementFormValues } from './utils/validations';

export const createUnitOfMeasurementDefaultValues: CreateUnitOfMeasurementFormValues =
  {
    name: '',
    status: UNIT_OF_MEASUREMENT_STATUS.DRAFT,
    symbol: '',
    comment: '',
  };
