import { z } from 'zod';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';
import type { CreateProductValues, CreateProductVariantValues } from '../types';

export const productNameSchema = z
  .string()
  .trim()
  .min(1, 'Product name is required');

export const productCategorySchema = z
  .string()
  .min(1, 'Category is required')
  .nullable()
  .refine((value) => value !== null, 'Category is required');

export const productVariantBarcodeSchema = z
  .string()
  .trim()
  .min(1, 'Barcode is required');

export const productVariantNameSchema = z
  .string()
  .trim()
  .min(1, 'Product variant name is required');

export const productVariantSkuSchema = z
  .string()
  .trim()
  .min(1, 'SKU is required');

type ProductVariantField = 'barcode' | 'name' | 'sku';

type ProductVariantUniqueField = 'barcode' | 'sku';

type ProductVariantFieldPath =
  `productVariants[${number}].${ProductVariantField}`;

type ProductVariantFieldErrors = Partial<
  Record<ProductVariantFieldPath, string>
>;

const getValidationMessage = (schema: z.ZodString, value: string) => {
  const result = schema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};

const getDuplicateVariantFieldIndexes = ({
  fieldName,
  productVariants,
}: {
  fieldName: ProductVariantUniqueField;
  productVariants: CreateProductVariantValues[];
}) => {
  const firstIndexByValue = new Map<string, number>();
  const duplicateIndexes = new Set<number>();

  productVariants.forEach((productVariant, index) => {
    const value = productVariant[fieldName].trim();

    if (!value) {
      return;
    }

    const firstIndex = firstIndexByValue.get(value);

    if (firstIndex === undefined) {
      firstIndexByValue.set(value, index);
      return;
    }

    duplicateIndexes.add(firstIndex);
    duplicateIndexes.add(index);
  });

  return duplicateIndexes;
};

const addProductVariantFieldErrors = ({
  duplicateIndexes = new Set<number>(),
  errors,
  fieldName,
  productVariants,
  requiredSchema,
  uniqueMessage,
}: {
  duplicateIndexes?: Set<number>;
  errors: ProductVariantFieldErrors;
  fieldName: ProductVariantField;
  productVariants: CreateProductVariantValues[];
  requiredSchema: z.ZodString;
  uniqueMessage?: string;
}) => {
  productVariants.forEach((productVariant, index) => {
    const fieldPath = `productVariants[${index}].${fieldName}` as const;
    const requiredMessage = getValidationMessage(
      requiredSchema,
      productVariant[fieldName]
    );

    if (requiredMessage) {
      errors[fieldPath] = requiredMessage;
      return;
    }

    if (uniqueMessage && duplicateIndexes.has(index)) {
      errors[fieldPath] = uniqueMessage;
    }
  });
};

export const validateProductName = ({ value }: ValidationArgs<string>) => {
  const result = productNameSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};

export const validateProductCategory = ({
  value,
}: ValidationArgs<string | null>) => {
  const result = productCategorySchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};

export const validateProductVariants = ({
  value,
}: ValidationArgs<CreateProductValues>) => {
  const errors: ProductVariantFieldErrors = {};
  const barcodeDuplicateIndexes = getDuplicateVariantFieldIndexes({
    fieldName: 'barcode',
    productVariants: value.productVariants,
  });
  const skuDuplicateIndexes = getDuplicateVariantFieldIndexes({
    fieldName: 'sku',
    productVariants: value.productVariants,
  });

  addProductVariantFieldErrors({
    errors,
    fieldName: 'name',
    productVariants: value.productVariants,
    requiredSchema: productVariantNameSchema,
  });
  addProductVariantFieldErrors({
    duplicateIndexes: barcodeDuplicateIndexes,
    errors,
    fieldName: 'barcode',
    productVariants: value.productVariants,
    requiredSchema: productVariantBarcodeSchema,
    uniqueMessage: 'Barcode must be unique across variants',
  });
  addProductVariantFieldErrors({
    duplicateIndexes: skuDuplicateIndexes,
    errors,
    fieldName: 'sku',
    productVariants: value.productVariants,
    requiredSchema: productVariantSkuSchema,
    uniqueMessage: 'SKU must be unique across variants',
  });

  return Object.keys(errors).length > 0
    ? {
        fields: errors,
      }
    : undefined;
};
