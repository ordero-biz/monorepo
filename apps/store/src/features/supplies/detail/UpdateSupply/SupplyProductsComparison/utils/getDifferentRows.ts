import type { SupplyEntryFormValues } from '../../../../shared/SupplyEditorForm/types';
import { normalizeSupplyEntry } from '../../utils/normalizeSupplyEntry';

const rowKey = (entry: SupplyEntryFormValues) =>
  JSON.stringify(normalizeSupplyEntry(entry));

// Match whole values as a multiset. Never infer row identity from a SKU or index.
export const getDifferentRows = (
  entries: SupplyEntryFormValues[],
  comparedEntries: SupplyEntryFormValues[]
) => {
  const available = new Map<string, number>();
  for (const entry of comparedEntries) {
    const key = rowKey(entry);
    available.set(key, (available.get(key) ?? 0) + 1);
  }
  return entries.map((entry) => {
    const key = rowKey(entry);
    const count = available.get(key) ?? 0;
    if (count === 0) return true;
    available.set(key, count - 1);
    return false;
  });
};
