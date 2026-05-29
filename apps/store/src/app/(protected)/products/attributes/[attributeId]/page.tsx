import { AttributeDetail } from '@/features/attributes/AttributeDetail/AttributeDetail';

type AttributeDetailPageProps = {
  params: Promise<{
    attributeId: string;
  }>;
};

export default async function AttributeDetailPage({
  params,
}: AttributeDetailPageProps) {
  const { attributeId } = await params;

  return <AttributeDetail attributeId={attributeId} />;
}
