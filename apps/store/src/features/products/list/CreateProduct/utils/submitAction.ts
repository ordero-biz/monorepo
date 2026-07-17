import { createProduct } from '@/lib/client/api/products';
import type { CreateProductValues } from '../types';

const mapProductFieldErrors = (fieldErrors?: Record<string, string>) => ({
  ...(fieldErrors?.name ? { productName: fieldErrors.name } : {}),
  ...(fieldErrors?.categoryId ? { category: fieldErrors.categoryId } : {}),
  ...(fieldErrors?.description ? { description: fieldErrors.description } : {}),
});

export const submitCreateProduct = async (value: CreateProductValues) => {
  const result = await createProduct({
    categoryId: Number(value.category ?? 0),
    description: value.description,
    name: value.productName.trim(),
    productVariants: value.productVariants.map((productVariant) => ({
      attributeValueIds: productVariant.attributeValueIds,
      barcode: productVariant.barcode.trim(),
      description: productVariant.description,
      name: productVariant.name.trim(),
      sku: productVariant.sku.trim(),
    })),
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
