import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { AttributesList } from '@/features/attributes/AttributesList/AttributesList';
import { AttributesListHeader } from '@/features/attributes/AttributesList/AttributesListHeader';
import { attributesListQueryOptions } from '@/lib/query/attributes/attributesQueryOptions';
import { makeQueryClient } from '@/lib/query/queryClient';
import { getServerAttributes } from '@/lib/server/api/attributes';
import {
  getPaginationSearchInput,
  type SearchParamsInput,
} from '@/lib/utils/url';

type AttributesPageProps = {
  searchParams?: Promise<SearchParamsInput>;
};

export default async function AttributesPage({
  searchParams,
}: AttributesPageProps = {}) {
  const paginationInput = getPaginationSearchInput(await searchParams);
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery(
    attributesListQueryOptions(getServerAttributes, paginationInput)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-[var(--space-2)]">
        <AttributesListHeader />
        <AttributesList paginationInput={paginationInput} />
      </div>
    </HydrationBoundary>
  );
}
