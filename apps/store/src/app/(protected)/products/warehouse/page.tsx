import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { WarehousesList, WarehousesListHeader } from '@/features/warehouses';
import { makeQueryClient } from '@/lib/query/queryClient';
import { warehousesListQueryOptions } from '@/lib/query/warehouses/warehousesQueryOptions';
import { getServerWarehouses } from '@/lib/server/api/warehouses';
import {
  getPaginationSearchInput,
  type SearchParamsInput,
} from '@/lib/utils/url';

type WarehousePageProps = {
  searchParams?: Promise<SearchParamsInput>;
};

export default async function WarehousePage({
  searchParams,
}: WarehousePageProps = {}) {
  const paginationInput = getPaginationSearchInput(await searchParams);
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery(
    warehousesListQueryOptions(getServerWarehouses, paginationInput)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-[var(--space-2)]">
        <WarehousesListHeader />
        <WarehousesList paginationInput={paginationInput} />
      </div>
    </HydrationBoundary>
  );
}
