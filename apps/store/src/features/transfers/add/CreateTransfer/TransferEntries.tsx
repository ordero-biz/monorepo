'use client';

import {
  Button,
  DataTable,
  Typography,
  useDataTableSelection,
} from '@ordero/ui';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { getColumns } from './columns';
import { TransferActions } from './TransferActions';
import type { TransferEntriesProps, TransferEntryFormValues } from './types';
import {
  createEmptyTransferEntry,
  getTransferSummary,
  hasOnlyBlankTransferEntry,
} from './utils/entries';

const getRowId = (entry: TransferEntryFormValues) => entry.clientId;

const getRowCheckboxAriaLabel = (entry: TransferEntryFormValues) =>
  `Select ${entry.stockItem?.productVariant.name || 'transfer entry'}`;

export const TransferEntries = ({
  disabled,
  entries,
  form,
  onSaveDraft,
  onValidateTransfer,
  onTransfer,
  pendingIntent,
}: TransferEntriesProps) => {
  const nextClientId = useRef(0);
  const addProductButtonRef = useRef<HTMLButtonElement>(null);
  const scrollAfterEntryCount = useRef<number | null>(null);
  const lastEntry = entries.at(-1);
  const { clearSelection, selectedRows, selection } = useDataTableSelection({
    data: entries,
    getRowCheckboxAriaLabel,
    getRowId,
    selectAllCheckboxAriaLabel: 'Select all transfer entries',
  });

  const appendEntry = useCallback(() => {
    form.pushFieldValue(
      'transferEntries',
      createEmptyTransferEntry(`new-${nextClientId.current++}`)
    );
  }, [form]);

  const scheduleScrollAfterAppend = () => {
    scrollAfterEntryCount.current = entries.length + 1;
  };

  useEffect(() => {
    if (scrollAfterEntryCount.current !== entries.length) {
      return;
    }

    scrollAfterEntryCount.current = null;
    addProductButtonRef.current?.scrollIntoView?.({
      block: 'center',
      inline: 'nearest',
    });
  }, [entries.length]);

  const deleteRows = useCallback(
    async (clientIds: Set<string>) => {
      if (
        form.state.isSubmitting ||
        hasOnlyBlankTransferEntry(form.state.values.transferEntries)
      ) {
        return;
      }
      const indexes = form.state.values.transferEntries.flatMap(
        (entry, index) => (clientIds.has(entry.clientId) ? [index] : [])
      );
      for (const index of indexes.reverse()) {
        await form.removeFieldValue('transferEntries', index);
      }
      if (form.state.values.transferEntries.length === 0) {
        appendEntry();
      }
      clearSelection();
    },
    [appendEntry, clearSelection, form]
  );

  const deleteEntry = useCallback(
    (clientId: string) => deleteRows(new Set([clientId])),
    [deleteRows]
  );

  const columns = useMemo(
    () => getColumns({ form, onDeleteEntry: deleteEntry }),
    [deleteEntry, form]
  );

  return (
    <>
      <div className="flex flex-col gap-[var(--space-2)]">
        <Typography variant="h6">Products to transfer</Typography>
        <DataTable
          ariaLabel="Transfer entries"
          columns={columns}
          data={entries}
          emptyMessage="No products in this transfer."
          getRowId={getRowId}
          selection={selection}
        />
        <Button
          disabled={disabled || Boolean(lastEntry && !lastEntry.stockItem)}
          onClick={() => {
            scheduleScrollAfterAppend();
            appendEntry();
          }}
          ref={addProductButtonRef}
          type="button"
          variant="text"
        >
          + Add another product
        </Button>
      </div>

      <TransferActions
        {...getTransferSummary(entries)}
        deleteDisabled={disabled || hasOnlyBlankTransferEntry(entries)}
        onClearSelection={clearSelection}
        onValidateTransfer={onValidateTransfer}
        onSaveDraft={onSaveDraft}
        onTransfer={onTransfer}
        pendingIntent={pendingIntent}
        onDeleteSelected={() => deleteRows(new Set(selectedRows.map(getRowId)))}
        selectedCount={selectedRows.length}
      />
    </>
  );
};
