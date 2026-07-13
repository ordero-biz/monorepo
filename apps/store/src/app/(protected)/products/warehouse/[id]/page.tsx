import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { WarehouseDetail } from '@/features/warehouses';
import { makeQueryClient } from '@/lib/query/queryClient';
import { warehouseQueryOptions } from '@/lib/query/warehouses/warehousesQueryOptions';
import { getServerWarehouse } from '@/lib/server/api/warehouses';

type WarehouseDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function WarehouseDetailPage({
  params,
}: WarehouseDetailPageProps) {
  const { id } = await params;
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery(
    warehouseQueryOptions(id, getServerWarehouse)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WarehouseDetail warehouseId={id} />
    </HydrationBoundary>
  );
}
