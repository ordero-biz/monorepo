import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/units-of-measurement/constants';
import type { CreateUnitOfMeasurementFormValues } from './utils/validations';

export const createUnitOfMeasurementDefaultValues: CreateUnitOfMeasurementFormValues =
  {
    name: '',
    status: UNIT_OF_MEASUREMENT_STATUS.DRAFT,
  };
