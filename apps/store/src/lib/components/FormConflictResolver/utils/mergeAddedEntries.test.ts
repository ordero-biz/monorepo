import {
  getAddedFormEntries,
  type IdentifiableFormEntry,
  mergeAddedFormEntries,
} from './mergeAddedEntries';

type TestEntry = IdentifiableFormEntry & {
  name: string;
  quantity: number | undefined;
};

const normalizeEntry = (entry: TestEntry) => ({
  name: entry.name.trim(),
  quantity: entry.quantity ?? null,
});

const placeholder: TestEntry = {
  clientId: 'initial-placeholder',
  name: '',
  quantity: undefined,
};

const rice: TestEntry = {
  clientId: 'existing-1',
  name: 'Rice',
  quantity: 2,
};

const beans: TestEntry = {
  clientId: 'existing-2',
  name: 'Beans',
  quantity: 4,
};

const added: TestEntry = {
  clientId: 'new-0',
  name: 'Lentils',
  quantity: 3,
};

describe('mergeAddedEntries', () => {
  it('returns added entries and appends them after saved entries when existing rows are unchanged', () => {
    const baseline = [rice];
    const current = [{ ...rice, name: ' Rice ' }, added];
    const latest = [{ ...rice, clientId: 'existing-10', quantity: 5 }, beans];

    expect(getAddedFormEntries({ baseline, current, normalizeEntry })).toEqual([
      added,
    ]);
    expect(
      mergeAddedFormEntries({ baseline, current, latest, normalizeEntry })
    ).toEqual({
      value: [...latest, added],
    });
  });

  it('strips the initial placeholder when merging added rows onto an empty or populated latest list', () => {
    const baseline = [placeholder];
    const editedPlaceholder = { ...placeholder, name: 'Unfinished' };

    expect(
      mergeAddedFormEntries({
        baseline,
        current: [editedPlaceholder],
        latest: [rice],
        normalizeEntry,
      })
    ).toEqual({
      value: [rice, editedPlaceholder],
    });
    expect(
      mergeAddedFormEntries({
        baseline: [rice],
        current: [rice, added],
        latest: [placeholder],
        normalizeEntry,
      })
    ).toEqual({
      value: [added],
    });
  });

  it('returns no added entries when no rows were added', () => {
    expect(
      getAddedFormEntries({
        baseline: [rice],
        current: [rice],
        normalizeEntry,
      })
    ).toEqual([]);
    expect(
      mergeAddedFormEntries({
        baseline: [rice],
        current: [rice],
        latest: [rice, beans],
        normalizeEntry,
      })
    ).toBeUndefined();
  });

  it.each([
    'edited',
    'deleted',
    'reordered',
  ] as const)('returns undefined when existing rows were %s alongside an addition', (change) => {
    const baseline = [rice, beans];
    const current = [...baseline];
    if (change === 'edited') {
      current[0] = { ...rice, quantity: 9 };
    } else if (change === 'deleted') {
      current.shift();
    } else {
      current.reverse();
    }
    current.push(added);

    expect(getAddedFormEntries({ baseline, current, normalizeEntry })).toEqual(
      []
    );
    expect(
      mergeAddedFormEntries({
        baseline,
        current,
        latest: [rice],
        normalizeEntry,
      })
    ).toBeUndefined();
  });
});
