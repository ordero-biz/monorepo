import { createUnitOfMeasurement } from '@/lib/client/api/units-of-measurement';
import { getApiErrorMessage } from '@/lib/utils/apiError';
import type { CreateUnitOfMeasurementFormValues } from './validations';

const normalizeCreateUnitOfMeasurementFormData = (
  data: CreateUnitOfMeasurementFormValues
) => {
  const symbol = data.symbol?.trim();
  const comment = data.comment?.trim();

  return {
    name: data.name.trim(),
    status: data.status,
    ...(symbol ? { symbol } : {}),
    ...(comment ? { comment } : {}),
  };
};

export const submitCreateUnitOfMeasurement = async (
  value: CreateUnitOfMeasurementFormValues
) => {
  const normalizedFormData = normalizeCreateUnitOfMeasurementFormData(value);
  const result = await createUnitOfMeasurement(normalizedFormData);

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
