'use client';

import { Typography } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { clientRoutes } from '@/lib/client/routes';
import {
  productGroupsQueryKeys,
  productVariantsQueryKeys,
} from '@/lib/query/products/productsQueryKeys';
import {
  PRODUCT_GENERATION_MODE,
  ProductVariantsCreationForm,
  type ProductVariantsGeneratedArgs,
  useCreateProductForm,
  useProductGenerationState,
  validateMultipleProductsConfiguration,
  validateSingleProductConfiguration,
} from '../../add/CreateProduct';
import { useProductVariantsGenerationForm } from './hooks/useProductVariantsGenerationForm';
import { ProductVariantsGenerationForm } from './ProductVariantsGenerationForm';

export const CreateProduct = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { form: productVariantsCreationForm } = useCreateProductForm({
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
