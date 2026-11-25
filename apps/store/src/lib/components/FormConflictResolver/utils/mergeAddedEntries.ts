import { areFormValuesEqual } from '@/lib/utils/form/comparison/areFormValuesEqual';
import type { FormMergeValues } from '@/lib/utils/form/comparison/mergeFormValues';

export type IdentifiableFormEntry = {
  clientId: string;
};

type GetAddedFormEntriesArgs<TEntry extends IdentifiableFormEntry> = Pick<
  FormMergeValues<TEntry[]>,
  'baseline' | 'current'
> & {
  normalizeEntry: (entry: TEntry) => unknown;
};

type MergeAddedFormEntriesArgs<TEntry extends IdentifiableFormEntry> =
  FormMergeValues<TEntry[]> & {
    normalizeEntry: (entry: TEntry) => unknown;
  };

export const getAddedFormEntries = <TEntry extends IdentifiableFormEntry>({
  baseline,
  current,
  normalizeEntry,
}: GetAddedFormEntriesArgs<TEntry>) => {
  // Compare local ids only with the editing baseline: saved ids may change.
  // The default empty row is a placeholder, not a persisted product.
  const initialEntries = baseline.filter(
    (entry) => entry.clientId !== 'initial-placeholder'
  );
  const initialIds = new Set(initialEntries.map((entry) => entry.clientId));
  const existingEntries = current.filter((entry) =>
    initialIds.has(entry.clientId)
  );
  const addedEntries = current.filter(
    (entry) => !initialIds.has(entry.clientId)
  );
  const existingEntriesUnchanged =
    areFormValuesEqual(
      existingEntries.map((entry) => entry.clientId),
      initialEntries.map((entry) => entry.clientId)
    ) &&
    areFormValuesEqual(
      existingEntries.map(normalizeEntry),
      initialEntries.map(normalizeEntry)
    );

  return existingEntriesUnchanged && !areFormValuesEqual(current, baseline)
    ? addedEntries
    : [];
};

export const mergeAddedFormEntries = <TEntry extends IdentifiableFormEntry>({
  baseline,
  current,
  latest,
  normalizeEntry,
}: MergeAddedFormEntriesArgs<TEntry>) => {
  const addedEntries = getAddedFormEntries({
    baseline,
    current,
    normalizeEntry,
  });
  if (addedEntries.length > 0) {
    const savedEntries = latest.filter(
      (entry) => entry.clientId !== 'initial-placeholder'
    );
    return { value: [...savedEntries, ...addedEntries] };
  }
  return undefined;
};
