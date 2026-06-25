import { AttributesList } from '@/features/attributes/AttributesList/AttributesList';
import { AttributesListHeader } from '@/features/attributes/AttributesList/AttributesListHeader';

export default function AttributesPage() {
  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <AttributesListHeader />
      <AttributesList />
    </div>
  );
}
