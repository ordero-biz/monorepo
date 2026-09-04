'use client';

import { PRODUCT_CREATION_MODE } from '@/lib/domain/products/constants';
import { CreateProduct } from '../../list/CreateProduct';
import { CreateSingleProductTemplateFields } from '../../list/CreateProduct/CreateProductTemplateFields';
import { validateSingleProduct } from '../../list/CreateProduct/utils/validations';

export const CreateSingleProduct = () => (
  <CreateProduct
    creationMode={PRODUCT_CREATION_MODE.single}
    TemplateFields={CreateSingleProductTemplateFields}
    validateProduct={validateSingleProduct}
  />
);
