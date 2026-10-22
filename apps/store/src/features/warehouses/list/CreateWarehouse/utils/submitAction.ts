import { createWarehouse } from '@/lib/client/api/warehouses';
import { getApiErrorMessage } from '@/lib/utils/apiError';
import type { CreateWarehouseFormValues } from './validations';

export const submitCreateWarehouse = async (
  value: CreateWarehouseFormValues
) => {
  const address = value.address?.trim();

  const result = await createWarehouse({
    name: value.name.trim(),
    comment: value.comment.trim(),
    status: value.status,
    ...(address ? { address } : {}),
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
