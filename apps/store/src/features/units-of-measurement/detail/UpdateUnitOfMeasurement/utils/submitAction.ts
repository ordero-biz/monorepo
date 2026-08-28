import {
  type UpdateUnitOfMeasurementFieldData,
  updateUnitOfMeasurement,
} from '@/lib/client/api/units-of-measurement';
import { getChangedValues } from '@/lib/utils/form/comparison/getChangedValues';
import type { UpdateUnitOfMeasurementFormValues } from './validations';

type SubmitUpdateUnitOfMeasurementArgs = {
  unitOfMeasurementId: string | number;
  submitData: UpdateUnitOfMeasurementFieldData;
};

type GetUnitOfMeasurementUpdateChangesArgs = {
  formValue: UpdateUnitOfMeasurementFormValues;
  initialValues: UpdateUnitOfMeasurementFormValues;
};

const normalizeUpdateUnitOfMeasurementFormData = (
  data: UpdateUnitOfMeasurementFormValues
) => ({
  name: data.name.trim(),
  status: data.status,
  symbol: data.symbol.trim(),
  comment: data.comment.trim(),
});

export const getUnitOfMeasurementUpdateChanges = ({
  formValue,
  initialValues,
}: GetUnitOfMeasurementUpdateChangesArgs) =>
  getChangedValues({
    initialData: normalizeUpdateUnitOfMeasurementFormData(initialValues),
    submitData: normalizeUpdateUnitOfMeasurementFormData(formValue),
  });

export const submitUpdateUnitOfMeasurement = async ({
  unitOfMeasurementId,
  submitData,
}: SubmitUpdateUnitOfMeasurementArgs) => {
  const result = await updateUnitOfMeasurement({
    unitOfMeasurementId,
    ...submitData,
  });

  if (!result.ok) {
    return {
      ok: false,
      error: {
        fieldErrors: result.error.fieldErrors,
        formError: result.error.message,
      },
    } as const;
  }

  return {
    ok: true,
    data: result.data,
  } as const;
};
