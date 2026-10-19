import { DataTable, Typography } from '@ordero/ui';
import { useMemo } from 'react';
import type { FormFieldRenderer } from '@/lib/components/FormConflictResolver';
import type { SupplyEntryFormValues } from '../../../shared/SupplyEditorForm/types';
import { isBlankSupplyEntry } from '../../../shared/SupplyEditorForm/utils';
import { getAddedSupplyEntries } from '../utils/mergeSupplyChanges';
import { columns } from './columns';
import type {
  SupplyProductPreviewRow,
  SupplyProductsComparisonProps,
  SupplyProductsTableProps,
} from './types';
import { getDifferentRows } from './utils/getDifferentRows';

const getRowTone = (row: SupplyProductPreviewRow) =>
  row.highlighted ? 'warning' : 'default';

const visibleEntries = (entries: SupplyEntryFormValues[]) =>
  entries.filter(
    (entry) =>
      entry.clientId !== 'initial-placeholder' || !isBlankSupplyEntry(entry)
  );

const rowCount = (entries: SupplyEntryFormValues[]) => {
  const count = visibleEntries(entries).length;
  return `${count} ${count === 1 ? 'row' : 'rows'}`;
};

export const SupplyProductsTable = ({
  label,
  entries,
  addedEntries,
  comparedEntries,
}: SupplyProductsTableProps) => {
  const rows = useMemo(() => {
    const addedIds = new Set(addedEntries?.map((entry) => entry.clientId));
    const visible = visibleEntries(entries);
    // Retained local additions already have known identity. Reserve their matches
    // so an identical saved addition is still shown as a difference.
    const differences = getDifferentRows(
      visible.filter((entry) => !addedIds.has(entry.clientId)),
      visibleEntries(comparedEntries ?? entries).filter(
        (entry) => !addedIds.has(entry.clientId)
      )
    );
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
  }, [entries, addedEntries, comparedEntries]);

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

export const SupplyProductsComparison = ({
  baseline,
  current,
  merged,
}: SupplyProductsComparisonProps) => {
  const addedEntries = useMemo(
    () => getAddedSupplyEntries({ baseline, current }),
    [baseline, current]
  );

  return (
    <div className="flex min-w-0 flex-col gap-[var(--space-1)]">
      <Typography color="text-secondary" variant="body2">
        After applying · {rowCount(merged)}
      </Typography>
      <Typography color="text-secondary" variant="body2">
        {addedEntries.length > 0
          ? `The latest saved products will appear first. Your ${rowCount(addedEntries)} will be kept at the end.`
          : 'This form will use the latest saved product list.'}
      </Typography>
      <SupplyProductsTable
        addedEntries={addedEntries}
        comparedEntries={current}
        entries={merged}
        label="Products after applying"
      />
      <details>
        <summary className="cursor-pointer text-muted-foreground">
          Products currently on your page ({rowCount(current)})
        </summary>
        <div className="mt-[var(--space-1)]">
          <SupplyProductsTable
            comparedEntries={merged}
            entries={current}
            label="Products currently on your page"
          />
        </div>
      </details>
    </div>
  );
};

export const supplyProductsRenderer: FormFieldRenderer<
  SupplyEntryFormValues[]
> = {
  renderUpdate: (values) => <SupplyProductsComparison {...values} />,
  renderChoice: ({ value: entries, otherValue, choice }) => {
    const label =
      choice === 'local' ? 'Your product list' : 'Saved product list';
    return {
      label: `${label} (${rowCount(entries)})`,
      content: (
        <SupplyProductsTable
          entries={entries}
          comparedEntries={otherValue}
          label={label}
        />
      ),
    };
  },
};
