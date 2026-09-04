'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { clientRoutes } from '@/lib/client/routes';
import { PRODUCT_CREATION_MODE } from '@/lib/domain/products/constants';
import {
  productGroupsQueryKeys,
  productVariantsQueryKeys,
} from '@/lib/query/products/productsQueryKeys';
import {
  CreateMultipleProductsTemplateFields,
  CreateProduct,
  useCreateProductForm,
  validateMultipleProducts,
} from '../CreateProduct';

export const CreateMultipleProducts = () => {
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
    validateProduct: validateMultipleProducts,
  });
  const onSubmit = () => form.handleSubmit();

  return (
    <CreateProduct
      creationMode={PRODUCT_CREATION_MODE.multiple}
      form={form}
      onSubmit={onSubmit}
      TemplateFields={CreateMultipleProductsTemplateFields}
    />
  );
};
