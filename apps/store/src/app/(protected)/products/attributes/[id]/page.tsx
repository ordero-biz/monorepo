import { AttributeDetail } from '@/features/attributes';

type AttributeDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AttributeDetailPage({
  params,
}: AttributeDetailPageProps) {
  const { id } = await params;

  return <AttributeDetail attributeId={id} />;
}
