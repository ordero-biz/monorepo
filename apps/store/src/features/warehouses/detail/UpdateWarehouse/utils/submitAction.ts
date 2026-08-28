import {
  type UpdateWarehouseFieldData,
  updateWarehouse,
} from '@/lib/client/api/warehouses';
import { getApiErrorMessage } from '@/lib/utils/apiError';

type SubmitUpdateWarehouseArgs = {
  submitData: UpdateWarehouseFieldData;
  warehouseId: string | number;
};

export const submitUpdateWarehouse = async ({
  submitData,
  warehouseId,
}: SubmitUpdateWarehouseArgs) => {
  const result = await updateWarehouse({
    warehouseId,
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
