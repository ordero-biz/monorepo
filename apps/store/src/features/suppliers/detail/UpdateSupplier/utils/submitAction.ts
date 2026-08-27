import { updateSupplier } from '@/lib/client/api/suppliers';
import { SUPPLIER_STATUS } from '@/lib/domain/suppliers/constants';
import type { SupplierStatus } from '@/lib/domain/suppliers/types';
import { getApiErrorMessage } from '@/lib/utils/apiError';
import type { UpdateSupplierFormValues } from './validations';

type SubmitUpdateSupplierArgs = {
  supplierId: string | number;
  supplierStatus: SupplierStatus;
  value: UpdateSupplierFormValues;
};

export const submitUpdateSupplier = async ({
  supplierId,
  supplierStatus,
  value,
}: SubmitUpdateSupplierArgs) => {
  const updateInput = {
    supplierId,
    email: value.email?.trim(),
    phone: value.phone?.trim(),
    address: value.address?.trim(),
    comment: value.comment?.trim(),
  };
  const result = await updateSupplier(
    supplierStatus === SUPPLIER_STATUS.ACTIVE
      ? updateInput
      : { ...updateInput, name: value.name.trim() }
  );

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
