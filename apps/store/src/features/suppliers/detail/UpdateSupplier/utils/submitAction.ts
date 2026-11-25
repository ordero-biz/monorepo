import {
  type UpdateSupplierFieldData,
  updateSupplier,
} from '@/lib/client/api/suppliers';
import { getApiErrorMessage } from '@/lib/utils/apiError';

type SubmitUpdateSupplierArgs = {
  supplierId: string | number;
  submitData: UpdateSupplierFieldData;
};

export const submitUpdateSupplier = async ({
  supplierId,
  submitData,
}: SubmitUpdateSupplierArgs) => {
  const result = await updateSupplier({ supplierId, ...submitData });

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
