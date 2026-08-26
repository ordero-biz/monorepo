import { updateUnitOfMeasurement } from '@/lib/client/api/units-of-measurement';
import type { UpdateUnitOfMeasurementFormValues } from './validations';

type SubmitUpdateUnitOfMeasurementArgs = {
  unitOfMeasurementId: string | number;
  value: UpdateUnitOfMeasurementFormValues;
};

export const submitUpdateUnitOfMeasurement = async ({
  unitOfMeasurementId,
  value,
}: SubmitUpdateUnitOfMeasurementArgs) => {
  const result = await updateUnitOfMeasurement({
    unitOfMeasurementId,
    name: value.name.trim(),
    status: value.status,
    symbol: value.symbol.trim(),
    comment: value.comment.trim(),
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
