import {
  dehydrate,
  HydrationBoundary,
  type QueryClient,
} from '@tanstack/react-query';
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
  warehouseTransfersQueryOptions,
} from '@/lib/query/warehouses/warehousesQueryOptions';
import {
  getServerWarehouse,
  getServerWarehouseStock,
  getServerWarehouseSupplies,
  getServerWarehouseTransfers,
} from '@/lib/server/api/warehouses';
import {
  getPaginationSearchInput,
  type PaginationSearchInput,
  type SearchParamsInput,
} from '@/lib/utils/url';

type WarehouseDetailPageProps = {
  searchParams?: Promise<SearchParamsInput>;
  params: Promise<{
    id: string;
  }>;
};

type PrefetchListArgs = {
  queryClient: QueryClient;
  warehouseId: string;
  input: PaginationSearchInput;
};

const listPrefetchers = {
  [WAREHOUSE_LIST_MODE.products]: ({
    queryClient,
    warehouseId,
    input,
  }: PrefetchListArgs) =>
    queryClient.prefetchQuery(
      warehouseStockQueryOptions({
        warehouseId,
        fetchWarehouseStock: getServerWarehouseStock,
        input,
      })
    ),
  [WAREHOUSE_LIST_MODE.supplies]: ({
    queryClient,
    warehouseId,
    input,
  }: PrefetchListArgs) =>
    queryClient.prefetchQuery(
      warehouseSuppliesQueryOptions({
        warehouseId,
        fetchWarehouseSupplies: getServerWarehouseSupplies,
        input,
      })
    ),
  [WAREHOUSE_LIST_MODE.movements]: ({
    queryClient,
    warehouseId,
    input,
  }: PrefetchListArgs) =>
    queryClient.prefetchQuery(
      warehouseTransfersQueryOptions({
        warehouseId,
        fetchWarehouseTransfers: getServerWarehouseTransfers,
        input,
      })
    ),
} as const;

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
    listPrefetchers[listMode]({
      queryClient,
      warehouseId: id,
      input: paginationInput,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WarehouseDetail warehouseId={id} paginationInput={paginationInput} />
    </HydrationBoundary>
  );
}
