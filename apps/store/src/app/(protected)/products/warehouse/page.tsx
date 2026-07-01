import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { WarehousesList, WarehousesListHeader } from '@/features/warehouses';
import { makeQueryClient } from '@/lib/query/queryClient';
import { warehousesListQueryOptions } from '@/lib/query/warehouses/warehousesQueryOptions';
import { getServerWarehouses } from '@/lib/server/api/warehouses';

export default async function WarehousePage() {
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery(
    warehousesListQueryOptions(getServerWarehouses)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-[var(--space-2)]">
        <WarehousesListHeader />
        <WarehousesList />
      </div>
    </HydrationBoundary>
  );
}
