'use client';

import {
  Button,
  DataTable,
  Typography,
  useDataTableSelection,
} from '@ordero/ui';
import { useCallback, useMemo, useRef } from 'react';
import { getColumns } from './columns';
import { SupplyActions } from './SupplyActions';
import type { SupplyEntriesProps, SupplyEntryFormValues } from './types';
import {
  createEmptySupplyEntry,
  getSupplyTotal,
  hasOnlyBlankSupplyEntry,
} from './utils';

const getRowId = (entry: SupplyEntryFormValues) => entry.clientId;

const getRowCheckboxAriaLabel = (entry: SupplyEntryFormValues) =>
  `Select ${entry.productVariant?.name || 'supply entry'}`;

export const SupplyEntries = ({
  entries,
  form,
  onSaveDraft,
  onFinalize,
  pendingIntent,
}: SupplyEntriesProps) => {
  const nextClientId = useRef(0);
  const lastEntry = entries.at(-1);
  const { clearSelection, selectedRows, selection } = useDataTableSelection({
    data: entries,
    getRowCheckboxAriaLabel,
    getRowId,
    selectAllCheckboxAriaLabel: 'Select all supply entries',
  });

  const appendEntry = useCallback(() => {
    form.pushFieldValue(
      'supplyEntries',
      createEmptySupplyEntry(`new-${nextClientId.current++}`)
    );
  }, [form]);

  const deleteRows = useCallback(
    async (clientIds: Set<string>) => {
      if (hasOnlyBlankSupplyEntry(form.state.values.supplyEntries)) {
        return;
      }
      const indexes = form.state.values.supplyEntries.flatMap((entry, index) =>
        clientIds.has(entry.clientId) ? [index] : []
      );
      for (const index of indexes.reverse()) {
        await form.removeFieldValue('supplyEntries', index);
      }
      if (form.state.values.supplyEntries.length === 0) {
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
    () =>
      getColumns({
        form,
        onDeleteEntry: deleteEntry,
      }),
    [deleteEntry, form]
  );

  return (
    <>
      <div className="flex flex-col gap-[var(--space-2)]">
        <Typography variant="h6">Supply products</Typography>
        <DataTable
          ariaLabel="Supply entries"
          columns={columns}
          data={entries}
          emptyMessage="No products in this supply."
          getRowId={getRowId}
          selection={selection}
        />
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button
              disabled={
                isSubmitting || Boolean(lastEntry && !lastEntry.productVariant)
              }
              onClick={appendEntry}
              type="button"
              variant="text"
            >
              + Add another product
            </Button>
          )}
        </form.Subscribe>
      </div>

      <SupplyActions
        {...getSupplyTotal(form.state.values)}
        deleteDisabled={hasOnlyBlankSupplyEntry(entries)}
        onClearSelection={clearSelection}
        onDeleteSelected={() => deleteRows(new Set(selectedRows.map(getRowId)))}
        onFinalize={onFinalize}
        onSaveDraft={onSaveDraft}
        pendingIntent={pendingIntent}
        selectedCount={selectedRows.length}
      />
    </>
  );
};
