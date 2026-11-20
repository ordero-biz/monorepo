import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { TransfersList, TransfersListHeader } from '@/features/transfers';
import { makeQueryClient } from '@/lib/query/queryClient';
import { transfersListQueryOptions } from '@/lib/query/transfers/transfersQueryOptions';
import { getServerTransfers } from '@/lib/server/api/transfers';
import {
  getPaginationSearchInput,
  type SearchParamsInput,
} from '@/lib/utils/url';

type TransfersPageProps = {
  searchParams?: Promise<SearchParamsInput>;
};

export default async function TransfersPage({
  searchParams,
}: TransfersPageProps = {}) {
  const paginationInput = getPaginationSearchInput(await searchParams);
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery(
    transfersListQueryOptions(getServerTransfers, paginationInput)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-[var(--space-2)]">
        <TransfersListHeader />
        <TransfersList paginationInput={paginationInput} />
      </div>
    </HydrationBoundary>
  );
}
