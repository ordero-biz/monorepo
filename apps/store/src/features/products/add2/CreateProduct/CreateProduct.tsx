'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { clientRoutes } from '@/lib/client/routes';
import {
  productGroupsQueryKeys,
  productVariantsQueryKeys,
} from '@/lib/query/products/productsQueryKeys';
import {
  DEFAULT_MAX_GENERATED_PRODUCT_VARIANTS,
  PRODUCT_GENERATION_MODE,
  ProductVariantsCreationForm,
  type ProductVariantsGeneratedArgs,
  useCreateProductForm,
  useProductGenerationState,
  useProductVariantsGenerationForm,
  validateSingleProductConfiguration,
} from '../../add/CreateProduct';
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
    validateConfiguration: validateSingleProductConfiguration,
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
      generationMode: PRODUCT_GENERATION_MODE.one,
      maxGeneratedProductVariants: DEFAULT_MAX_GENERATED_PRODUCT_VARIANTS,
      onProductVariantsGenerated: handleProductVariantsGenerated,
    });

  return (
    <div className="flex flex-col gap-[var(--space-3)]">
      <header>
        <h1 className="text-[length:var(--h3-size-desktop)] leading-[var(--h3-line-height-desktop)] font-[var(--h3-weight)] [font-family:var(--h3-family)]">
          Create product
        </h1>
      </header>
      {isProductVariantGenerationStage ? (
        <ProductVariantsGenerationForm
          productVariantsGenerationForm={productVariantsGenerationForm}
        />
      ) : (
        <ProductVariantsCreationForm
          generatedAttributes={generatedAttributes}
          generationMode={PRODUCT_GENERATION_MODE.one}
          productVariantsCreationForm={productVariantsCreationForm}
        />
      )}
    </div>
  );
};
