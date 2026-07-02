import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { CategoryList } from '@/features/categories';
import { categoriesListQueryOptions } from '@/lib/query/categories/categoriesQueryOptions';
import { makeQueryClient } from '@/lib/query/queryClient';
import { getServerCategories } from '@/lib/server/api/categories';
import {
  getPaginationSearchInput,
  type SearchParamsInput,
} from '@/lib/utils/url';

type CategoriesPageProps = {
  searchParams?: Promise<SearchParamsInput>;
};

export default async function CategoriesPage({
  searchParams,
}: CategoriesPageProps = {}) {
  const paginationInput = getPaginationSearchInput(await searchParams);
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery(
    categoriesListQueryOptions(getServerCategories, paginationInput)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoryList paginationInput={paginationInput} />
    </HydrationBoundary>
  );
}
