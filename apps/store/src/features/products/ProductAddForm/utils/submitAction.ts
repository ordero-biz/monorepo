import { createProduct } from '@/lib/client/api/products';
import type { ProductAddFormValues } from '../types';

const mapProductFieldErrors = (fieldErrors?: Record<string, string>) => ({
  ...(fieldErrors?.name ? { productName: fieldErrors.name } : {}),
  ...(fieldErrors?.categoryId ? { category: fieldErrors.categoryId } : {}),
});

export const submitCreateProduct = async (value: ProductAddFormValues) => {
  const result = await createProduct({
    categoryId: Number(value.category ?? 0),
    description: '',
    name: value.productName.trim(),
  });

  if (!result.ok) {
    return {
      ok: false,
      error: {
        fieldErrors: mapProductFieldErrors(result.error.fieldErrors),
        formError: result.error.message,
      },
    } as const;
  }

  return {
    ok: true,
    data: result.data,
  } as const;
};
