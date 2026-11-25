import { createSupplier } from '@/lib/client/api/suppliers';
import type { CreateSupplierFormValues } from './validations';

const normalizeCreateSupplierFormData = (data: CreateSupplierFormValues) => {
  const email = data.email?.trim();
  const phone = data.phone?.trim();
  const address = data.address?.trim();
  const comment = data.comment?.trim();

  return {
    name: data.name.trim(),
    status: data.status,
    ...(email ? { email } : {}),
    ...(phone ? { phone } : {}),
    ...(address ? { address } : {}),
    ...(comment ? { comment } : {}),
  };
};

export const submitCreateSupplier = async (value: CreateSupplierFormValues) => {
  const normalizedFormData = normalizeCreateSupplierFormData(value);
  const result = await createSupplier(normalizedFormData);

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
