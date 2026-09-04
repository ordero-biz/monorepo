import { PRODUCT_CREATION_MODE } from '@/lib/domain/products/constants';
import { CreateProduct } from '../../list/CreateProduct';

export const CreateMultipleProducts = () => (
  <CreateProduct creationMode={PRODUCT_CREATION_MODE.multiple} />
);
