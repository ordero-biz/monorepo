'use client';

import { SupplyEntries } from './SupplyEntries';
import { SupplyInformation } from './SupplyInformation';
import type { SupplyEditorFormProps } from './types';

export const SupplyEditorForm = ({
  form,
  pendingIntent,
  submit,
}: SupplyEditorFormProps) => (
  <form
    className="flex flex-col gap-[var(--space-3)]"
    noValidate
    onSubmit={(event) => {
      event.preventDefault();
      return submit('draft');
    }}
  >
    <SupplyInformation form={form} />

    <form.Subscribe selector={(state) => state.values.supplyEntries}>
      {(entries) => (
        <SupplyEntries
          entries={entries}
          form={form}
          onFinalize={() => submit('finalize')}
          onSaveDraft={() => submit('draft')}
          pendingIntent={pendingIntent}
        />
      )}
    </form.Subscribe>
  </form>
);
