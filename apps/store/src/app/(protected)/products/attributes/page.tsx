import { AtrributeDataTable, AttributeHeader } from '@/features/attributes';

export default function AttributesPage() {
  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <AttributeHeader />
      <AtrributeDataTable />
    </div>
  );
}
