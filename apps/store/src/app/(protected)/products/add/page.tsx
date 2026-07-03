import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ProductAddForm } from '@/features/products';
import { productsCategoriesQueryInput } from '@/lib/hooks/products/productsCategoriesQueryConfig';
import { categoriesListQueryOptions } from '@/lib/query/categories/categoriesQueryOptions';
import { makeQueryClient } from '@/lib/query/queryClient';
import { getServerCategories } from '@/lib/server/api/categories';

export default async function AddProductPage() {
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery(
    categoriesListQueryOptions(
      getServerCategories,
      productsCategoriesQueryInput
    )
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductAddForm />
    </HydrationBoundary>
  );
}
