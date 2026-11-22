'use client';

import { TransferEntries } from './TransferEntries';
import { TransferInformation } from './TransferInformation';
import type { TransferEditorFormProps } from './types';

export const TransferEditorForm = ({
  form,
  submit,
  pendingIntent,
  onSourceWarehouseChange,
  sourceWarehouseRef,
  children,
}: TransferEditorFormProps) => {
  const disabled = pendingIntent !== null;

  return (
    <form
      aria-busy={disabled}
      aria-label="Transfer"
      className="flex flex-col gap-[var(--space-3)]"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        return submit('draft');
      }}
    >
      <TransferInformation
        disabled={disabled}
        form={form}
        onSourceWarehouseChange={onSourceWarehouseChange}
        sourceWarehouseRef={sourceWarehouseRef}
      />
      <form.Subscribe selector={(state) => state.values.transferEntries}>
        {(entries) => (
          <TransferEntries
            disabled={disabled}
            entries={entries}
            form={form}
            onSaveDraft={() => submit('draft')}
            onTransfer={() => submit('transfer')}
            pendingIntent={pendingIntent}
          />
        )}
      </form.Subscribe>
      {children}
    </form>
  );
};
