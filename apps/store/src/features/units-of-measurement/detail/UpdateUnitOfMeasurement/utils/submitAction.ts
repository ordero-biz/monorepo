import {
  type UpdateUnitOfMeasurementFieldData,
  updateUnitOfMeasurement,
} from '@/lib/client/api/units-of-measurement';
import { getApiErrorMessage } from '@/lib/utils/apiError';

type SubmitUpdateUnitOfMeasurementArgs = {
  submitData: UpdateUnitOfMeasurementFieldData;
  unitOfMeasurementId: string | number;
};

export const submitUpdateUnitOfMeasurement = async ({
  submitData,
  unitOfMeasurementId,
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
        formError: getApiErrorMessage(result.error),
      },
    } as const;
  }

  return {
    ok: true,
    data: result.data,
  } as const;
};
