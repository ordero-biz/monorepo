import { updateSupplier } from '@/lib/client/api/suppliers';
import type { SupplierEntityFormValues } from '../../../shared/SupplierFormDialogContent';

type SubmitUpdateSupplierArgs = {
  supplierId: string | number;
  value: SupplierEntityFormValues;
};

export const submitUpdateSupplier = async ({
  supplierId,
  value,
}: SubmitUpdateSupplierArgs) => {
  const result = await updateSupplier({
    supplierId,
    name: value.name.trim(),
    email: value.email.trim(),
    phone: value.phone.trim(),
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
