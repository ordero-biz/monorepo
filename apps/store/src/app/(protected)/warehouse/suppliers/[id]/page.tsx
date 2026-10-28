import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { SupplierDetail } from '@/features/suppliers';
import { makeQueryClient } from '@/lib/query/queryClient';
import { supplierQueryOptions } from '@/lib/query/suppliers/suppliersQueryOptions';
import { getServerSupplier } from '@/lib/server/api/suppliers';

type SupplierDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SupplierDetailPage({
  params,
}: SupplierDetailPageProps) {
  const { id } = await params;
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery(supplierQueryOptions(id, getServerSupplier));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SupplierDetail supplierId={id} />
    </HydrationBoundary>
  );
}
