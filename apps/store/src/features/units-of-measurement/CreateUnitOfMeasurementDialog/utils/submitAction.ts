import { createUnitOfMeasurement } from '@/lib/client/api/units-of-measurement';
import type { CreateUnitOfMeasurementFormValues } from './validations';

export const submitCreateUnitOfMeasurement = async (
  value: CreateUnitOfMeasurementFormValues
) => {
  const result = await createUnitOfMeasurement({
    code: value.code.trim(),
    name: value.name.trim(),
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
