import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { WarehouseDetail } from '@/features/warehouses';
import { makeQueryClient } from '@/lib/query/queryClient';
import {
  warehouseQueryOptions,
  warehouseStockQueryOptions,
} from '@/lib/query/warehouses/warehousesQueryOptions';
import {
  getServerWarehouse,
  getServerWarehouseStock,
} from '@/lib/server/api/warehouses';
import {
  getPaginationSearchInput,
  type SearchParamsInput,
} from '@/lib/utils/url';

type WarehouseDetailPageProps = {
  searchParams?: Promise<SearchParamsInput>;
  params: Promise<{
    id: string;
  }>;
};

export default async function WarehouseDetailPage({
  params,
  searchParams,
}: WarehouseDetailPageProps) {
  const { id } = await params;
  const paginationInput = getPaginationSearchInput(await searchParams);
  const queryClient = makeQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(warehouseQueryOptions(id, getServerWarehouse)),
    queryClient.prefetchQuery(
      warehouseStockQueryOptions({
        warehouseId: id,
        fetchWarehouseStock: getServerWarehouseStock,
        input: paginationInput,
      })
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WarehouseDetail warehouseId={id} paginationInput={paginationInput} />
    </HydrationBoundary>
  );
}
