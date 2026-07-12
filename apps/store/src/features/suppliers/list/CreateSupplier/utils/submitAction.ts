import { createSupplier } from '@/lib/client/api/suppliers';
import type { SupplierEntityFormValues } from '../../../shared/SupplierFormDialogContent';

export const submitCreateSupplier = async (value: SupplierEntityFormValues) => {
  const result = await createSupplier({
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
