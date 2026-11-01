'use client';

import { PageHeader, Typography } from '@ordero/ui';
import { useCreateProductForm } from './hooks/useCreateProductForm';
import { useProductGenerationState } from './hooks/useProductGenerationState';
import { useProductVariantsGenerationForm } from './hooks/useProductVariantsGenerationForm';
import { ProductVariantsCreationForm } from './ProductVariantsCreationForm';
import { ProductVariantsGenerationForm } from './ProductVariantsGenerationForm';
import type { CreateProductProps } from './types';

export const CreateProduct = ({
  generationMode,
  maxGeneratedProductVariants,
  onCreated,
  validateConfiguration,
}: CreateProductProps) => {
  const { form: productVariantsCreationForm } = useCreateProductForm({
    onCreated,
    validateConfiguration,
  });

  const {
    generatedAttributes,
    isProductVariantGenerationStage,
    onProductVariantsGenerated,
  } = useProductGenerationState();

  const handleProductVariantsGenerated = (
    args: Parameters<typeof onProductVariantsGenerated>[0]
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
      generationMode,
      maxGeneratedProductVariants,
      onProductVariantsGenerated: handleProductVariantsGenerated,
    });

  return (
    <>
      <PageHeader.Root>
        <PageHeader.Left>
          <Typography variant="h5">Create product</Typography>
        </PageHeader.Left>
        <PageHeader.Right></PageHeader.Right>
      </PageHeader.Root>

      {isProductVariantGenerationStage ? (
        <ProductVariantsGenerationForm
          productVariantsGenerationForm={productVariantsGenerationForm}
          generationMode={generationMode}
          maxGeneratedProductVariants={maxGeneratedProductVariants}
        />
      ) : (
        <ProductVariantsCreationForm
          productVariantsCreationForm={productVariantsCreationForm}
          generatedAttributes={generatedAttributes}
          generationMode={generationMode}
        />
      )}
    </>
  );
};
