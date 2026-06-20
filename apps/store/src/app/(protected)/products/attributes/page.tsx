import { AttributesList, AttributesListHeader } from '@/features/attributes';

export default function AttributesPage() {
  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <AttributesListHeader />
      <AttributesList />
    </div>
  );
}
