'use client';

import { PRODUCT_CREATION_MODE } from '@/lib/domain/products/constants';
import { CreateProduct } from '../../list/CreateProduct';
import { CreateMultipleProductsTemplateFields } from '../../list/CreateProduct/CreateProductTemplateFields';
import { validateMultipleProducts } from '../../list/CreateProduct/utils/validations';

export const CreateMultipleProducts = () => (
  <CreateProduct
    creationMode={PRODUCT_CREATION_MODE.multiple}
    TemplateFields={CreateMultipleProductsTemplateFields}
    validateProduct={validateMultipleProducts}
  />
);
