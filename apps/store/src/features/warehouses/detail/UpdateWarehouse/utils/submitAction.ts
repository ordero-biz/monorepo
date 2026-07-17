import { updateWarehouse } from '@/lib/client/api/warehouses';
import type { CreateWarehouseFormValues } from '../../../list/CreateWarehouse/utils/validations';

type SubmitUpdateWarehouseArgs = {
  value: CreateWarehouseFormValues;
  warehouseId: string | number;
};

export const submitUpdateWarehouse = async ({
  value,
  warehouseId,
}: SubmitUpdateWarehouseArgs) => {
  const result = await updateWarehouse({
    warehouseId,
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
