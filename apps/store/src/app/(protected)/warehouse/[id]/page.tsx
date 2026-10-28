import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { WarehouseDetail } from '@/features/warehouses';
import {
  getWarehouseListMode,
  WAREHOUSE_LIST_MODE,
  WAREHOUSE_LIST_MODE_SEARCH_PARAM,
} from '@/lib/domain/warehouses/constants';
import { makeQueryClient } from '@/lib/query/queryClient';
import {
  warehouseQueryOptions,
  warehouseStockQueryOptions,
  warehouseSuppliesQueryOptions,
} from '@/lib/query/warehouses/warehousesQueryOptions';
import {
  getServerWarehouse,
  getServerWarehouseStock,
  getServerWarehouseSupplies,
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
  const resolvedSearchParams = await searchParams;
  const paginationInput = getPaginationSearchInput(resolvedSearchParams);
  const listMode = getWarehouseListMode(
    resolvedSearchParams?.[WAREHOUSE_LIST_MODE_SEARCH_PARAM]
  );
  const queryClient = makeQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(warehouseQueryOptions(id, getServerWarehouse)),
    listMode === WAREHOUSE_LIST_MODE.supplies
      ? queryClient.prefetchQuery(
          warehouseSuppliesQueryOptions({
            warehouseId: id,
            fetchWarehouseSupplies: getServerWarehouseSupplies,
            input: paginationInput,
          })
        )
      : queryClient.prefetchQuery(
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
