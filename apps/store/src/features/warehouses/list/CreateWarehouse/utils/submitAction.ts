import { createWarehouse } from '@/lib/client/api/warehouses';
import type { WarehouseFormValues } from '../../../shared/validations';

export const submitCreateWarehouse = async (
  value: WarehouseFormValues
) => {
  const result = await createWarehouse({
    code: value.code.trim(),
    name: value.name.trim(),
    address: value.address.trim(),
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
