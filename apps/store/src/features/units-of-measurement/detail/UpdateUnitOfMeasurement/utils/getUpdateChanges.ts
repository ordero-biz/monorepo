import type { UpdateUnitOfMeasurementFieldData } from '@/lib/client/api/units-of-measurement';
import type { UnitOfMeasurement } from '@/lib/domain/units-of-measurement/types';
import { getChangedValues } from '@/lib/utils/form/comparison/getChangedValues';
import { getUnitOfMeasurementDefaultValues } from './fields';
import type { UpdateUnitOfMeasurementFormValues } from './validations';

type GetUpdateChangesArgs = {
  formValue: UpdateUnitOfMeasurementFormValues;
  unitOfMeasurement: UnitOfMeasurement;
};

const normalizeUpdateUnitOfMeasurementFormData = (
  data: UpdateUnitOfMeasurementFormValues
) => ({
  comment: data.comment?.trim() || null,
  name: data.name.trim(),
  symbol: data.symbol?.trim() || null,
});

export const getUnitOfMeasurementUpdateChanges = ({
  formValue,
  unitOfMeasurement,
}: GetUpdateChangesArgs): UpdateUnitOfMeasurementFieldData | undefined =>
  getChangedValues({
    initialData: normalizeUpdateUnitOfMeasurementFormData(
      getUnitOfMeasurementDefaultValues(unitOfMeasurement)
    ),
    submitData: normalizeUpdateUnitOfMeasurementFormData(formValue),
  });
