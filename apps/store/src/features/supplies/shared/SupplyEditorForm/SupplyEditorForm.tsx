'use client';

import { FormConflictResolver } from '@/lib/components/FormConflictResolver';
import { SupplyEntries } from './SupplyEntries';
import { SupplyInformation } from './SupplyInformation';
import type { SupplyEditorFormProps } from './types';

export const SupplyEditorForm = ({
  form,
  pendingIntent,
  submit,
}: SupplyEditorFormProps) => {
  const resolver = FormConflictResolver.useContext();
  const submitDisabled = resolver?.isReadOnly ?? false;

  return (
    <form
      aria-busy={pendingIntent !== null}
      aria-label="Supply"
      className="flex flex-col gap-[var(--space-3)]"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (!submitDisabled) {
          return submit('draft');
        }
      }}
    >
      <SupplyInformation disabled={pendingIntent !== null} form={form} />

      <form.Subscribe selector={(state) => state.values.supplyEntries}>
        {(entries) => (
          <SupplyEntries
            disabled={pendingIntent !== null}
            entries={entries}
            form={form}
            onFinalize={() => {
              if (!submitDisabled) return submit('finalize');
            }}
            onSaveDraft={() => {
              if (!submitDisabled) return submit('draft');
            }}
            pendingIntent={pendingIntent}
          />
        )}
      </form.Subscribe>
    </form>
  );
};
