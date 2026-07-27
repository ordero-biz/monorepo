import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import {
  getProductsListMode,
  PRODUCTS_LIST_MODE,
  ProductsListView,
} from '@/features/products';
import {
  productGroupsListQueryOptions,
  productVariantsListQueryOptions,
} from '@/lib/query/products/productsQueryOptions';
import { makeQueryClient } from '@/lib/query/queryClient';
import {
  getServerProductGroups,
  getServerProductVariants,
} from '@/lib/server/api/products';
import {
  getPaginationSearchInput,
  type SearchParamsInput,
} from '@/lib/utils/url';

type ProductsPageProps = {
  searchParams?: Promise<SearchParamsInput>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps = {}) {
  const resolvedSearchParams = await searchParams;
  const paginationInput = getPaginationSearchInput(resolvedSearchParams);
  const listMode = getProductsListMode(resolvedSearchParams?.listMode);
  const queryClient = makeQueryClient();

  if (listMode === PRODUCTS_LIST_MODE.productGroups) {
    await queryClient.prefetchQuery(
      productGroupsListQueryOptions(getServerProductGroups, paginationInput)
    );
  } else {
    await queryClient.prefetchQuery(
      productVariantsListQueryOptions(getServerProductVariants, paginationInput)
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsListView paginationInput={paginationInput} />
    </HydrationBoundary>
  );
}
