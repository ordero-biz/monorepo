import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { UnitOfMeasurementDetail } from '@/features/units-of-measurement';
import { makeQueryClient } from '@/lib/query/queryClient';
import { unitOfMeasurementQueryOptions } from '@/lib/query/units-of-measurement/unitsOfMeasurementQueryOptions';
import { getServerUnitOfMeasurement } from '@/lib/server/api/units-of-measurement';

type UnitOfMeasurementDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UnitOfMeasurementDetailPage({
  params,
}: UnitOfMeasurementDetailPageProps) {
  const { id } = await params;
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery(
    unitOfMeasurementQueryOptions(id, getServerUnitOfMeasurement)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UnitOfMeasurementDetail unitOfMeasurementId={id} />
    </HydrationBoundary>
  );
}
