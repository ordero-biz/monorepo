import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { SuppliersList, SuppliersListHeader } from '@/features/suppliers';
import { makeQueryClient } from '@/lib/query/queryClient';
import { suppliersListQueryOptions } from '@/lib/query/suppliers/suppliersQueryOptions';
import { getServerSuppliers } from '@/lib/server/api/suppliers';
import {
  getPaginationSearchInput,
  type SearchParamsInput,
} from '@/lib/utils/url';

type SuppliersPageProps = {
  searchParams?: Promise<SearchParamsInput>;
};

export default async function SuppliersPage({
  searchParams,
}: SuppliersPageProps = {}) {
  const paginationInput = getPaginationSearchInput(await searchParams);
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery(
    suppliersListQueryOptions(getServerSuppliers, paginationInput)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-[var(--space-2)]">
        <SuppliersListHeader />
        <SuppliersList paginationInput={paginationInput} />
      </div>
    </HydrationBoundary>
  );
}
