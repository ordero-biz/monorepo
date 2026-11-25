import { DataTable, Typography } from '@ordero/ui';
import { useMemo } from 'react';
import type {
  CreateFormEntriesRendererArgs,
  FormEntriesComparisonProps,
  FormEntriesTableProps,
  FormEntryPreviewRow,
  FormFieldRenderer,
} from './types';
import { getDifferentRows } from './utils/getDifferentRows';
import {
  getAddedFormEntries,
  type IdentifiableFormEntry,
} from './utils/mergeAddedEntries';

const getRowTone = <TEntry extends IdentifiableFormEntry>(
  row: FormEntryPreviewRow<TEntry>
) => (row.highlighted ? 'warning' : 'default');

const getVisibleEntries = <TEntry extends IdentifiableFormEntry>(
  entries: TEntry[],
  isBlankEntry: (entry: TEntry) => boolean
) =>
  entries.filter(
    (entry) => entry.clientId !== 'initial-placeholder' || !isBlankEntry(entry)
  );

const getRowCountLabel = <TEntry extends IdentifiableFormEntry>(
  entries: TEntry[],
  isBlankEntry: (entry: TEntry) => boolean
) => {
  const count = getVisibleEntries(entries, isBlankEntry).length;
  return `${count} ${count === 1 ? 'row' : 'rows'}`;
};

export const FormEntriesTable = <TEntry extends IdentifiableFormEntry>({
  label,
  entries,
  addedEntries,
  comparedEntries,
  columns,
  isBlankEntry,
  normalizeEntry,
}: FormEntriesTableProps<TEntry>) => {
  const rows = useMemo(() => {
    const addedIds = new Set(addedEntries?.map((entry) => entry.clientId));
    const visible = getVisibleEntries(entries, isBlankEntry);
    // Retained local additions already have known identity. Reserve their matches
    // so an identical saved addition is still shown as a difference.
    const differences = getDifferentRows({
      entries: visible.filter((entry) => !addedIds.has(entry.clientId)),
      comparedEntries: getVisibleEntries(
        comparedEntries ?? entries,
        isBlankEntry
      ).filter((entry) => !addedIds.has(entry.clientId)),
      normalizeEntry,
    });
    let differenceIndex = 0;
    return visible.map((entry) => {
      const added = addedIds.has(entry.clientId);
      const different = added ? false : differences[differenceIndex++];
      return {
        ...entry,
        different,
        highlighted: different || added,
        source: addedEntries
          ? addedIds.has(entry.clientId)
            ? ('Your added row · kept' as const)
            : ('Saved version' as const)
          : undefined,
      };
    });
  }, [entries, addedEntries, comparedEntries, isBlankEntry, normalizeEntry]);

  return (
    <DataTable
      ariaLabel={label}
      columns={columns}
      data={rows}
      emptyMessage="No products"
      getRowTone={getRowTone}
    />
  );
};

export const FormEntriesComparison = <TEntry extends IdentifiableFormEntry>({
  baseline,
  current,
  merged,
  columns,
  isBlankEntry,
  normalizeEntry,
}: FormEntriesComparisonProps<TEntry>) => {
  const addedEntries = useMemo(
    () => getAddedFormEntries({ baseline, current, normalizeEntry }),
    [baseline, current, normalizeEntry]
  );

  return (
    <div className="flex min-w-0 flex-col gap-[var(--space-1)]">
      <Typography color="text-secondary" variant="body2">
        After applying · {getRowCountLabel(merged, isBlankEntry)}
      </Typography>
      <Typography color="text-secondary" variant="body2">
        {addedEntries.length > 0
          ? `The latest saved products will appear first. Your ${getRowCountLabel(addedEntries, isBlankEntry)} will be kept at the end.`
          : 'This form will use the latest saved product list.'}
      </Typography>
      <FormEntriesTable
        addedEntries={addedEntries}
        columns={columns}
        comparedEntries={current}
        entries={merged}
        isBlankEntry={isBlankEntry}
        label="Products after applying"
        normalizeEntry={normalizeEntry}
      />
      <details>
        <summary className="cursor-pointer text-muted-foreground">
          Products currently on your page (
          {getRowCountLabel(current, isBlankEntry)})
        </summary>
        <div className="mt-[var(--space-1)]">
          <FormEntriesTable
            columns={columns}
            comparedEntries={merged}
            entries={current}
            isBlankEntry={isBlankEntry}
            label="Products currently on your page"
            normalizeEntry={normalizeEntry}
          />
        </div>
      </details>
    </div>
  );
};

export const createFormEntriesRenderer = <
  TEntry extends IdentifiableFormEntry,
>({
  columns,
  isBlankEntry,
  normalizeEntry,
}: CreateFormEntriesRendererArgs<TEntry>): FormFieldRenderer<TEntry[]> => ({
  renderUpdate: (values) => (
    <FormEntriesComparison
      {...values}
      columns={columns}
      isBlankEntry={isBlankEntry}
      normalizeEntry={normalizeEntry}
    />
  ),
  renderChoice: ({ value: entries, otherValue, choice }) => {
    const label =
      choice === 'local' ? 'Your product list' : 'Saved product list';
    return {
      label: `${label} (${getRowCountLabel(entries, isBlankEntry)})`,
      content: (
        <FormEntriesTable
          columns={columns}
          comparedEntries={otherValue}
          entries={entries}
          isBlankEntry={isBlankEntry}
          label={label}
          normalizeEntry={normalizeEntry}
        />
      ),
    };
  },
});
