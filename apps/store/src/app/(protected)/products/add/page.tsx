import {
  CreateMultipleProducts,
  CreateSingleProduct,
} from '@/features/products';
import {
  getProductCreationMode,
  PRODUCT_CREATION_MODE,
} from '@/lib/domain/products/constants';
import type { SearchParamsInput } from '@/lib/utils/url';

type AddProductPageProps = {
  searchParams?: Promise<SearchParamsInput>;
};

export default async function AddProductPage({
  searchParams,
}: AddProductPageProps = {}) {
  const resolvedSearchParams = await searchParams;
  const creationMode = getProductCreationMode(
    resolvedSearchParams?.creationMode
  );

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      {creationMode === PRODUCT_CREATION_MODE.multiple ? (
        <CreateMultipleProducts />
      ) : (
        <CreateSingleProduct />
      )}
    </div>
  );
}
