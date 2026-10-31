'use client';

import { Typography } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { clientRoutes } from '@/lib/client/routes';
import {
  productGroupsQueryKeys,
  productVariantsQueryKeys,
} from '@/lib/query/products/productsQueryKeys';
import {
  PRODUCT_GENERATION_MODE,
  type ProductCommonValues,
  ProductVariantsCreationForm,
  type ProductVariantsGeneratedArgs,
  useCreateProductForm,
  useProductGenerationState,
  validateMultipleProductsConfiguration,
  validateSingleProductConfiguration,
} from '../../add/CreateProduct';
import { CommonProductData } from './CommonProductData';
import { useProductVariantsGenerationForm } from './hooks/useProductVariantsGenerationForm';
import { ProductVariantsGenerationForm } from './ProductVariantsGenerationForm';
import {
  getProductDetailsErrors,
  getProductDetailsFormErrors,
} from './utils/getProductDetailsErrors';
import { updateProductDetails } from './utils/updateProductDetails';

export const CreateProduct = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [isEditingProductDetails, setIsEditingProductDetails] = useState(false);

  const openProductDetailsEditorForErrors = (
    fieldErrors: Record<string, string>
  ) => {
    const errors = getProductDetailsErrors(fieldErrors);
    if (Object.keys(errors).length > 0) {
      setIsEditingProductDetails(true);
    }
  };

  const { form: productVariantsCreationForm } = useCreateProductForm({
    onFieldErrors: openProductDetailsEditorForErrors,
    onCreated: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: productGroupsQueryKeys.list,
        }),
        queryClient.invalidateQueries({
          queryKey: productVariantsQueryKeys.list,
        }),
      ]);
      router.push(clientRoutes.products);
    },
    validateConfiguration: (value) =>
      productVariantsGenerationForm.getFieldValue('generationMode') ===
      PRODUCT_GENERATION_MODE.one
        ? validateSingleProductConfiguration(value)
        : validateMultipleProductsConfiguration(value),
  });

  const {
    generatedAttributes,
    isProductVariantGenerationStage,
    onProductVariantsGenerated,
  } = useProductGenerationState();

  const handleProductVariantsGenerated = (
    args: ProductVariantsGeneratedArgs
  ) => {
    onProductVariantsGenerated(args);
    productVariantsCreationForm.setFieldValue('category', args.category);
    productVariantsCreationForm.setFieldValue('description', args.description);
    productVariantsCreationForm.setFieldValue('name', args.name);
    productVariantsCreationForm.setFieldValue(
      'productVariants',
      args.productVariants
    );
  };

  const { form: productVariantsGenerationForm } =
    useProductVariantsGenerationForm({
      onProductVariantsGenerated: handleProductVariantsGenerated,
    });

  const applyProductDetails = (values: ProductCommonValues) => {
    updateProductDetails({ form: productVariantsCreationForm, values });
    setIsEditingProductDetails(false);
  };

  return (
    <div className="flex flex-col gap-[var(--space-3)]">
      <header className="flex flex-col gap-[var(--space-0-5)]">
        <h1 className="text-[length:var(--h5-size-mobile)] leading-[var(--h5-line-height-mobile)] font-[var(--h5-weight)] [font-family:var(--h5-family)] tracking-[var(--h5-letter-spacing)] md:text-[length:var(--h5-size-desktop)] md:leading-[var(--h5-line-height-desktop)]">
          Create product
        </h1>
        <Typography color="text-secondary" variant="body2">
          {isProductVariantGenerationStage
            ? 'Step 1 of 2 · Product setup'
            : 'Step 2 of 2 · Review & create'}
        </Typography>
      </header>
      {isProductVariantGenerationStage ? (
        <ProductVariantsGenerationForm
          productVariantsGenerationForm={productVariantsGenerationForm}
        />
      ) : (
        <ProductVariantsCreationForm
          isEditingProductDetails={isEditingProductDetails}
          commonProductFields={
            <productVariantsCreationForm.Subscribe
              selector={(state) =>
                [
                  state.values.name,
                  state.values.category,
                  state.values.description,
                  state.values.status,
                  state.values.productVariants.length,
                  state.fieldMeta,
                  state.submissionAttempts,
                ] as const
              }
            >
              {([
                name,
                category,
                description,
                status,
                variantCount,
                fieldMeta,
                submissionAttempts,
              ]) => (
                <CommonProductData
                  values={{ name, category, description, status }}
                  variantCount={variantCount}
                  isEditing={isEditingProductDetails}
                  editorErrors={getProductDetailsFormErrors({
                    fieldMeta,
                    submissionAttempts,
                  })}
                  onEditingChange={setIsEditingProductDetails}
                  onApply={applyProductDetails}
                />
              )}
            </productVariantsCreationForm.Subscribe>
          }
          generatedAttributes={generatedAttributes}
          generationMode={productVariantsGenerationForm.getFieldValue(
            'generationMode'
          )}
          productVariantsCreationForm={productVariantsCreationForm}
        />
      )}
    </div>
  );
};
