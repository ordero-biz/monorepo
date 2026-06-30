import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { AttributeDetail } from '@/features/attributes';
import {
  getServerAttribute,
  getServerAttributeValues,
} from '@/lib/api/api/attributes';
import {
  attributeQueryOptions,
  attributeValuesQueryOptions,
} from '@/lib/query/attributes/attributesQueryOptions';
import { makeQueryClient } from '@/lib/query/queryClient';

type AttributeDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AttributeDetailPage({
  params,
}: AttributeDetailPageProps) {
  const { id } = await params;
  const queryClient = makeQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(attributeQueryOptions(id, getServerAttribute)),
    queryClient.prefetchQuery(
      attributeValuesQueryOptions(id, getServerAttributeValues)
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AttributeDetail attributeId={id} />
    </HydrationBoundary>
  );
}
