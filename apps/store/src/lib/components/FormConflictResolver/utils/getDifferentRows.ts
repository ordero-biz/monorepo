type GetDifferentRowsArgs<TEntry> = {
  entries: readonly TEntry[];
  comparedEntries: readonly TEntry[];
  normalizeEntry: (entry: TEntry) => unknown;
};

// Match whole values as a multiset. Never infer row identity from a SKU or index.
export const getDifferentRows = <TEntry>({
  entries,
  comparedEntries,
  normalizeEntry,
}: GetDifferentRowsArgs<TEntry>) => {
  const rowKey = (entry: TEntry) => JSON.stringify(normalizeEntry(entry));
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
