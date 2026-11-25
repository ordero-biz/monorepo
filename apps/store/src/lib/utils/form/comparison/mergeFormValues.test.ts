import { type FormMergeFields, mergeFormValues } from './mergeFormValues';

type Values = {
  name: string;
  limit: number;
  active: boolean;
  note: string | null;
};

const fields: FormMergeFields<Values> = {
  name: { label: 'Name', normalize: (value) => value.trim(), describe: String },
  limit: { label: 'Limit', describe: String },
  active: { label: 'Active', describe: String },
  note: { label: 'Note', describe: (value) => value ?? '(empty)' },
};
const baseline: Values = {
  name: 'Original',
  limit: 1,
  active: true,
  note: 'Note',
};

describe('mergeFormValues', () => {
  it('combines independent edits while preserving numbers, booleans and cleared values', () => {
    const result = mergeFormValues({
      baseline,
      current: { ...baseline, active: false, note: null },
      latest: { ...baseline, name: 'Renamed', limit: 2 },
      fields,
    });

    expect(result.values).toEqual({
      name: 'Renamed',
      limit: 2,
      active: false,
      note: null,
    });
    expect(result.changedFields).toEqual(['active', 'note']);
    expect(result.conflicts).toEqual([]);
    expect(result.updates).toEqual([
      {
        field: 'name',
        label: 'Name',
        currentValue: 'Original',
        mergedValue: 'Renamed',
      },
      { field: 'limit', label: 'Limit', currentValue: '1', mergedValue: '2' },
    ]);
    expect(result.hasUnresolvedConflicts).toBe(false);
  });

  it('requires choices for all competing edits and applies each choice independently', () => {
    const args = {
      baseline,
      current: { ...baseline, name: 'Local', limit: 2 },
      latest: { ...baseline, name: 'Saved', limit: 3 },
      fields,
    };
    const unresolved = mergeFormValues(args);
    expect(unresolved.values).toEqual(args.current);
    expect(unresolved.conflicts.map(({ field }) => field)).toEqual([
      'name',
      'limit',
    ]);
    expect(unresolved.hasUnresolvedConflicts).toBe(true);
    expect(unresolved.updates).toEqual([]);
    expect(
      mergeFormValues({ ...args, choices: { name: 'local' } })
        .hasUnresolvedConflicts
    ).toBe(true);

    const resolved = mergeFormValues({
      ...args,
      choices: { name: 'local', limit: 'server' },
    });
    expect(resolved.values).toEqual({ ...baseline, name: 'Local', limit: 3 });
    expect(resolved.changedFields).toEqual(['name']);
    expect(resolved.hasUnresolvedConflicts).toBe(false);
    expect(resolved.updates).toEqual([]);
  });

  it('uses saved values for equivalent normalized edits', () => {
    const result = mergeFormValues({
      baseline,
      current: { ...baseline, name: ' Renamed ' },
      latest: { ...baseline, name: 'Renamed' },
      fields,
    });
    expect(result.values.name).toBe('Renamed');
    expect(result.updates).toEqual([]);
    expect(result.conflicts).toEqual([]);
    expect(result.changedFields).toEqual([]);
  });

  it('treats arrays as a single conflicting field unless a merge rule is supplied', () => {
    const result = mergeFormValues({
      baseline: { tags: ['base'] },
      current: { tags: ['base', 'local'] },
      latest: { tags: ['base', 'saved'] },
      fields: {
        tags: {
          label: 'Tags',
          describe: (tags) => tags.join(', '),
          helperText: 'Choose a tag list.',
        },
      },
    });
    expect(result.conflicts).toEqual([
      {
        field: 'tags',
        label: 'Tags',
        localValue: 'base, local',
        serverValue: 'base, saved',
        helperText: 'Choose a tag list.',
      },
    ]);
    expect(result.hasUnresolvedConflicts).toBe(true);
  });

  it('allows a feature to merge an additive collection before normal comparison', () => {
    const result = mergeFormValues({
      baseline: { tags: ['base'] },
      current: { tags: ['base', 'local'] },
      latest: { tags: ['base', 'saved'] },
      fields: {
        tags: {
          label: 'Tags',
          describe: (tags) => tags.join(', '),
          merge: ({ current, latest }) => ({
            value: [...new Set([...latest, ...current])],
          }),
        },
      },
    });
    expect(result.values.tags).toEqual(['base', 'saved', 'local']);
    expect(result.updates).toEqual([
      {
        field: 'tags',
        label: 'Tags',
        currentValue: 'base, local',
        mergedValue: 'base, saved, local',
      },
    ]);
    expect(result.changedFields).toEqual(['tags']);
    expect(result.conflicts).toEqual([]);
  });

  it('falls back to explicit conflict resolution when a custom rule cannot merge', () => {
    const result = mergeFormValues({
      baseline,
      current: { ...baseline, limit: 2 },
      latest: { ...baseline, limit: 3 },
      fields: { ...fields, limit: { ...fields.limit, merge: () => undefined } },
    });
    expect(result.conflicts[0].field).toBe('limit');
    expect(result.hasUnresolvedConflicts).toBe(true);
  });
});
