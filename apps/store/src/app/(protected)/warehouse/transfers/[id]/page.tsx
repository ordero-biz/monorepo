import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { TransferDetail } from '@/features/transfers';
import { makeQueryClient } from '@/lib/query/queryClient';
import { transferQueryOptions } from '@/lib/query/transfers/transfersQueryOptions';
import { getServerTransfer } from '@/lib/server/api/transfers';

type TransferDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TransferDetailPage({
  params,
}: TransferDetailPageProps) {
  const { id } = await params;
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery(transferQueryOptions(id, getServerTransfer));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TransferDetail transferId={id} />
    </HydrationBoundary>
  );
}
