import { createProductGroup } from '@/lib/client/api/products';
import type { CreateProductValues } from '../types';

const mapProductFieldName = (fieldName: string) => {
  if (fieldName === 'name') {
    return 'productName';
  }

  if (fieldName === 'categoryId') {
    return 'category';
  }

  return fieldName.replace(/^productVariants\.(\d+)\./, 'productVariants[$1].');
};

const mapProductFieldErrors = (fieldErrors?: Record<string, string>) =>
  fieldErrors
    ? Object.fromEntries(
        Object.entries(fieldErrors).map(([fieldName, errorMessage]) => [
          mapProductFieldName(fieldName),
          errorMessage,
        ])
      )
    : undefined;

export const submitCreateProduct = async (value: CreateProductValues) => {
  const result = await createProductGroup({
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
