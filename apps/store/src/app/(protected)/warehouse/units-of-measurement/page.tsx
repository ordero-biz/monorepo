import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import {
  UnitsOfMeasurementList,
  UnitsOfMeasurementListHeader,
} from '@/features/units-of-measurement';
import { makeQueryClient } from '@/lib/query/queryClient';
import { unitsOfMeasurementListQueryOptions } from '@/lib/query/units-of-measurement/unitsOfMeasurementQueryOptions';
import { getServerUnitsOfMeasurement } from '@/lib/server/api/units-of-measurement';
import {
  getPaginationSearchInput,
  type SearchParamsInput,
} from '@/lib/utils/url';

type UnitsOfMeasurementPageProps = {
  searchParams?: Promise<SearchParamsInput>;
};

export default async function UnitsOfMeasurementPage({
  searchParams,
}: UnitsOfMeasurementPageProps = {}) {
  const paginationInput = getPaginationSearchInput(await searchParams);
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery(
    unitsOfMeasurementListQueryOptions(
      getServerUnitsOfMeasurement,
      paginationInput
    )
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-[var(--space-2)]">
        <UnitsOfMeasurementListHeader />
        <UnitsOfMeasurementList paginationInput={paginationInput} />
      </div>
    </HydrationBoundary>
  );
}
