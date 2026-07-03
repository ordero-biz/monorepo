import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ProductsList, ProductsListHeader } from '@/features/products';
import { productsListQueryOptions } from '@/lib/query/products/productsQueryOptions';
import { makeQueryClient } from '@/lib/query/queryClient';
import { getServerProducts } from '@/lib/server/api/products';
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
    productsListQueryOptions(getServerProducts, paginationInput)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-[var(--space-2)]">
        <ProductsListHeader />
        <ProductsList paginationInput={paginationInput} />
      </div>
    </HydrationBoundary>
  );
}
