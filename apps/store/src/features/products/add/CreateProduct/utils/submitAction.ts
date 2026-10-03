import { createProductGroup } from '@/lib/client/api/products';
import type { ProductVariantsCreationValues } from '../types';

const getOptionalDescription = (value: string) => {
  const description = value.trim();

  return description ? { description } : {};
};

const normalizeCreateProductFormData = (
  value: ProductVariantsCreationValues
) => ({
  categoryId: Number(value.category),
  name: value.name.trim(),
  status: value.status,
  ...getOptionalDescription(value.description),
  productVariants: value.productVariants.map((productVariant) => ({
    attributeValueIds: productVariant.attributeValueIds,
    barcode: productVariant.barcode.trim(),
    name: productVariant.name.trim(),
    sku: productVariant.sku.trim(),
    status: productVariant.status,
    ...getOptionalDescription(productVariant.description),
  })),
});

export const submitCreateProduct = async (
  value: ProductVariantsCreationValues
) => {
  const normalizedFormData = normalizeCreateProductFormData(value);
  const result = await createProductGroup(normalizedFormData);

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
