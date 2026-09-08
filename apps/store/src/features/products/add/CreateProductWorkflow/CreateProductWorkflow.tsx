'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { clientRoutes } from '@/lib/client/routes';
import {
  PRODUCT_CREATION_MODE,
  type ProductCreationMode,
} from '@/lib/domain/products/constants';
import {
  productGroupsQueryKeys,
  productVariantsQueryKeys,
} from '@/lib/query/products/productsQueryKeys';
import { CreateProduct, PRODUCT_GENERATION_MODE } from '../CreateProduct';
import {
  validateMultipleProductsConfiguration,
  validateSingleProductConfiguration,
} from '../CreateProduct/utils/validations';
import type { CreateProductWorkflowProps } from './types';

const configurationByCreationMode = {
  [PRODUCT_CREATION_MODE.single]: {
    generationMode: PRODUCT_GENERATION_MODE.one,
    validateConfiguration: validateSingleProductConfiguration,
  },
  [PRODUCT_CREATION_MODE.multiple]: {
    generationMode: PRODUCT_GENERATION_MODE.many,
    validateConfiguration: validateMultipleProductsConfiguration,
  },
} satisfies Record<
  ProductCreationMode,
  {
    generationMode: (typeof PRODUCT_GENERATION_MODE)[keyof typeof PRODUCT_GENERATION_MODE];
    validateConfiguration: typeof validateSingleProductConfiguration;
  }
>;

export const CreateProductWorkflow = ({
  creationMode,
}: CreateProductWorkflowProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { generationMode, validateConfiguration } =
    configurationByCreationMode[creationMode];

  const onCreated = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: productGroupsQueryKeys.list }),
      queryClient.invalidateQueries({
        queryKey: productVariantsQueryKeys.list,
      }),
    ]);
    router.push(clientRoutes.products);
  };

  return (
    <CreateProduct
      generationMode={generationMode}
      onCreated={onCreated}
      validateConfiguration={validateConfiguration}
    />
  );
};
