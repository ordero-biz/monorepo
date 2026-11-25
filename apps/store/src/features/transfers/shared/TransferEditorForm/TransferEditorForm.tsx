'use client';

import { FormConflictResolver } from '@/lib/components/FormConflictResolver';
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
  const resolver = FormConflictResolver.useContext();
  const submitDisabled = resolver?.isReadOnly ?? false;
  const disabled = pendingIntent !== null;

  return (
    <form
      aria-busy={disabled}
      aria-label="Transfer"
      className="flex flex-col gap-[var(--space-3)]"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (!submitDisabled) {
          return submit('draft');
        }
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
            onSaveDraft={() => {
              if (!submitDisabled) {
                return submit('draft');
              }
            }}
            onTransfer={() => {
              if (!submitDisabled) {
                return submit('transfer');
              }
            }}
            pendingIntent={pendingIntent}
          />
        )}
      </form.Subscribe>
      {children}
    </form>
  );
};
