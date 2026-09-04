'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { clientRoutes } from '@/lib/client/routes';
import {
  productGroupsQueryKeys,
  productVariantsQueryKeys,
} from '@/lib/query/products/productsQueryKeys';
import {
  CreateProduct,
  PRODUCT_GENERATION_MODE,
  useCreateProductForm,
  validateSingleProduct,
} from '../CreateProduct';
import { useProductGenerationState } from '../CreateProduct/hooks/useProductGenerationState';
import { CreateSingleProductTemplateFields } from './CreateSingleProductTemplateFields';

export const CreateSingleProduct = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const onCreated = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: productGroupsQueryKeys.list }),
      queryClient.invalidateQueries({
        queryKey: productVariantsQueryKeys.list,
      }),
    ]);
    router.push(clientRoutes.products);
  };
  const { form } = useCreateProductForm({
    onCreated,
    validateProduct: validateSingleProduct,
  });
  const onSubmit = () => form.handleSubmit();
  const generation = useProductGenerationState();

  return (
    <CreateProduct
      generationMode={PRODUCT_GENERATION_MODE.one}
      form={form}
      generation={generation}
      onSubmit={onSubmit}
      TemplateFields={CreateSingleProductTemplateFields}
    />
  );
};
