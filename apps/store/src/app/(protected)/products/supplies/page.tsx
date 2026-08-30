import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { SuppliesList, SuppliesListHeader } from '@/features/supplies';
import { makeQueryClient } from '@/lib/query/queryClient';
import { suppliesListQueryOptions } from '@/lib/query/supplies/suppliesQueryOptions';
import { getServerSupplies } from '@/lib/server/api/supplies';
import {
  getPaginationSearchInput,
  type SearchParamsInput,
} from '@/lib/utils/url';

type SuppliesPageProps = {
  searchParams?: Promise<SearchParamsInput>;
};

export default async function SuppliesPage({
  searchParams,
}: SuppliesPageProps = {}) {
  const paginationInput = getPaginationSearchInput(await searchParams);
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery(
    suppliesListQueryOptions(getServerSupplies, paginationInput)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-[var(--space-2)]">
        <SuppliesListHeader />
        <SuppliesList paginationInput={paginationInput} />
      </div>
    </HydrationBoundary>
  );
}
