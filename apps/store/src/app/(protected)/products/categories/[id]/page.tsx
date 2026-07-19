import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { CategoryDetail } from '@/features/categories';
import { categoryQueryOptions } from '@/lib/query/categories/categoriesQueryOptions';
import { makeQueryClient } from '@/lib/query/queryClient';
import { getServerCategory } from '@/lib/server/api/categories';

type CategoryDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CategoryDetailPage({
  params,
}: CategoryDetailPageProps) {
  const { id } = await params;
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery(
    categoryQueryOptions(id, getServerCategory)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoryDetail categoryId={id} />
    </HydrationBoundary>
  );
}
