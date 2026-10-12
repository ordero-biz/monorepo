import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { SupplyDetail } from '@/features/supplies';
import { makeQueryClient } from '@/lib/query/queryClient';
import { supplyQueryOptions } from '@/lib/query/supplies/suppliesQueryOptions';
import { getServerSupply } from '@/lib/server/api/supplies';

type SupplyDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SupplyDetailPage({ params }: SupplyDetailPageProps) {
  const { id } = await params;
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery(supplyQueryOptions(id, getServerSupply));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SupplyDetail supplyId={id} />
    </HydrationBoundary>
  );
};
