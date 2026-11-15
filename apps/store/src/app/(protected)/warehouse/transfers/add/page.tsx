import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { CreateTransfer } from '@/features/transfers';
import {
  getTransferSourceWarehouseId,
  TRANSFER_SOURCE_WAREHOUSE_SEARCH_PARAM,
} from '@/lib/domain/transfers/constants';
import { makeQueryClient } from '@/lib/query/queryClient';
import { warehouseQueryOptions } from '@/lib/query/warehouses/warehousesQueryOptions';
import { getServerWarehouse } from '@/lib/server/api/warehouses';
import type { SearchParamsInput } from '@/lib/utils/url';

type AddTransferPageProps = {
  searchParams?: Promise<SearchParamsInput>;
};

export default async function AddTransferPage({
  searchParams,
}: AddTransferPageProps) {
  const resolvedSearchParams = await searchParams;
  const sourceWarehouseId = getTransferSourceWarehouseId(
    resolvedSearchParams?.[TRANSFER_SOURCE_WAREHOUSE_SEARCH_PARAM]
  );
  const queryClient = makeQueryClient();

  if (sourceWarehouseId) {
    await queryClient.prefetchQuery(
      warehouseQueryOptions(sourceWarehouseId, getServerWarehouse)
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CreateTransfer sourceWarehouseId={sourceWarehouseId} />
    </HydrationBoundary>
  );
}
