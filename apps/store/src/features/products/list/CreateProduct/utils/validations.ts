import { z } from 'zod';
import { getValidationMessage } from '@/lib/utils/form/validation/message';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';
import { PRODUCT_GENERATION_MODE } from '../constants';
import type {
  CreateProductValues,
  CreateProductVariantValues,
  ProductGenerationMode,
} from '../types';

export const productNameSchema = z
  .string()
  .trim()
  .min(1, 'Product name is required');

export const productCategorySchema = z
  .string()
  .min(1, 'Category is required')
  .nullable()
  .refine((value) => value !== null, 'Category is required');

export const productVariantAttributeValueIdsSchema = z
  .array(z.number())
  .min(1, 'Select at least one attribute value');

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

type ProductVariantField = 'attributeValueIds' | 'barcode' | 'name' | 'sku';

type ProductVariantTextField = 'barcode' | 'name' | 'sku';

type ProductVariantUniqueField = 'barcode' | 'sku';

type ProductVariantFieldPath =
  `productVariants[${number}].${ProductVariantField}`;

type ProductVariantFieldErrors = Partial<
  Record<ProductVariantFieldPath, string>
>;

type ProductTemplateField =
  | 'attributes'
  | 'attributeValues'
  | 'category'
  | 'productName';

type ProductTemplateFieldErrors = Partial<Record<ProductTemplateField, string>>;

const hasSelectedAttributeValues = ({
  attributeValues,
  attributes,
}: Pick<CreateProductValues, 'attributeValues' | 'attributes'>) =>
  attributes.some(
    (attribute) => (attributeValues[String(attribute.id)] ?? []).length > 0
  );

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

const getAttributeValueIdsKey = (attributeValueIds: number[]) =>
  [...new Set(attributeValueIds)]
    .sort((firstId, secondId) => firstId - secondId)
    .join('|');

const getDuplicateAttributeValueIndexes = (
  productVariants: CreateProductVariantValues[]
) => {
  const firstIndexByValue = new Map<string, number>();
  const duplicateIndexes = new Set<number>();

  productVariants.forEach((productVariant, index) => {
    if (productVariant.attributeValueIds.length === 0) {
      return;
    }

    const value = getAttributeValueIdsKey(productVariant.attributeValueIds);
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
  fieldName: ProductVariantTextField;
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

const addProductVariantAttributeValueErrors = ({
  duplicateIndexes,
  errors,
  productVariants,
  requireAttributeValueIds,
}: {
  duplicateIndexes: Set<number>;
  errors: ProductVariantFieldErrors;
  productVariants: CreateProductVariantValues[];
  requireAttributeValueIds: boolean;
}) => {
  productVariants.forEach((productVariant, index) => {
    const fieldPath = `productVariants[${index}].attributeValueIds` as const;

    if (requireAttributeValueIds) {
      const validationMessage = getValidationMessage(
        productVariantAttributeValueIdsSchema,
        productVariant.attributeValueIds
      );

      if (validationMessage) {
        errors[fieldPath] = validationMessage;
        return;
      }
    }

    if (duplicateIndexes.has(index)) {
      errors[fieldPath] = 'Attribute values must be unique across variants';
    }
  });
};

export const validateProductName = ({ value }: ValidationArgs<string>) => {
  return getValidationMessage(productNameSchema, value);
};

export const validateProductCategory = ({
  value,
}: ValidationArgs<string | null>) => {
  return getValidationMessage(productCategorySchema, value);
};

type ValidateProductTemplateArgs = ValidationArgs<CreateProductValues> & {
  generationMode: ProductGenerationMode;
};

type ValidateProductVariantsArgs = ValidationArgs<CreateProductValues> & {
  requireAttributeValueIds: boolean;
};

type ValidateCreateProductArgs = ValidationArgs<CreateProductValues> & {
  generationMode: ProductGenerationMode;
};

export const validateProductTemplate = ({
  generationMode,
  value,
}: ValidateProductTemplateArgs) => {
  const errors: ProductTemplateFieldErrors = {};
  const productNameError = validateProductName({ value: value.productName });
  const categoryError = validateProductCategory({ value: value.category });
  const requiresAttributes = generationMode === PRODUCT_GENERATION_MODE.many;

  if (productNameError) {
    errors.productName = productNameError;
  }

  if (categoryError) {
    errors.category = categoryError;
  }

  if (requiresAttributes) {
    if (value.attributes.length === 0) {
      errors.attributes = 'Select at least one attribute.';
    } else if (!hasSelectedAttributeValues(value)) {
      errors.attributeValues = 'Select at least one attribute value.';
    }
  }

  return Object.keys(errors).length > 0
    ? {
        fields: errors,
      }
    : undefined;
};

export const validateProductVariants = ({
  requireAttributeValueIds,
  value,
}: ValidateProductVariantsArgs) => {
  const errors: ProductVariantFieldErrors = {};
  const barcodeDuplicateIndexes = getDuplicateVariantFieldIndexes({
    fieldName: 'barcode',
    productVariants: value.productVariants,
  });
  const skuDuplicateIndexes = getDuplicateVariantFieldIndexes({
    fieldName: 'sku',
    productVariants: value.productVariants,
  });
  const attributeValueDuplicateIndexes = getDuplicateAttributeValueIndexes(
    value.productVariants
  );
  addProductVariantAttributeValueErrors({
    duplicateIndexes: attributeValueDuplicateIndexes,
    errors,
    productVariants: value.productVariants,
    requireAttributeValueIds,
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

export const validateCreateProduct = ({
  generationMode,
  value,
}: ValidateCreateProductArgs) => {
  const templateErrors = validateProductTemplate({ generationMode, value });
  const variantErrors = validateProductVariants({
    requireAttributeValueIds: generationMode === PRODUCT_GENERATION_MODE.many,
    value,
  });
  const fields = {
    ...templateErrors?.fields,
    ...variantErrors?.fields,
  };

  return Object.keys(fields).length > 0
    ? {
        fields,
      }
    : undefined;
};

export const validateSingleProduct = (value: CreateProductValues) =>
  validateCreateProduct({
    generationMode: PRODUCT_GENERATION_MODE.one,
    value,
  });

export const validateMultipleProducts = (value: CreateProductValues) =>
  validateCreateProduct({
    generationMode: PRODUCT_GENERATION_MODE.many,
    value,
  });
