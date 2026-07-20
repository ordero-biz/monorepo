import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ProductsListView } from '@/features/products';
import { productVariantsListQueryOptions } from '@/lib/query/products/productsQueryOptions';
import { makeQueryClient } from '@/lib/query/queryClient';
import { getServerProductVariants } from '@/lib/server/api/products';
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
  const paginationInput = getPaginationSearchInput(await searchParams);
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery(
    productVariantsListQueryOptions(getServerProductVariants, paginationInput)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsListView paginationInput={paginationInput} />
    </HydrationBoundary>
  );
}
