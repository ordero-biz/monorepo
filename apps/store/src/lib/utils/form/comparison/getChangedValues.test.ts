import { getChangedValues, type ChangedValues } from './getChangedValues';

describe('getChangedValues', () => {
  it('returns undefined when values are unchanged', () => {
    expect(
      getChangedValues({
        initialData: {
          name: 'Shoes',
          parentId: 1,
        },
        submitData: {
          name: 'Shoes',
          parentId: 1,
        },
      })
    ).toBeUndefined();
  });

  it('includes only changed top-level values', () => {
    expect(
      getChangedValues({
        initialData: {
          name: 'Shoes',
          parentId: 1,
        },
        submitData: {
          name: 'Running shoes',
          parentId: 1,
        },
      })
    ).toEqual({
      name: 'Running shoes',
    });
  });

  it('preserves the structure of changed nested values', () => {
    expect(
      getChangedValues({
        initialData: {
          name: 'Shoes',
          settings: {
            description: 'All shoes',
            title: 'Footwear',
          },
        },
        submitData: {
          name: 'Shoes',
          settings: {
            description: 'Running shoes',
            title: 'Footwear',
          },
        },
      })
    ).toEqual({
      settings: {
        description: 'Running shoes',
      },
    });
  });

  it('preserves null values used to clear fields', () => {
    expect(
      getChangedValues({
        initialData: {
          parentId: 1 as number | null,
        },
        submitData: {
          parentId: null,
        },
      })
    ).toEqual({
      parentId: null,
    });
  });

  it('preserves changed undefined values', () => {
    expect(
      getChangedValues({
        initialData: {
          description: 'All shoes' as string | undefined,
          name: 'Shoes',
        },
        submitData: {
          description: undefined,
          name: 'Running shoes',
        },
      })
    ).toEqual({
      description: undefined,
      name: 'Running shoes',
    });
  });

  it('preserves removed nested values as undefined', () => {
    type ProductValues = {
      settings: {
        description?: string;
        title: string;
      };
    };

    const expectedChanges: ChangedValues<ProductValues> = {
      settings: {
        description: undefined,
      },
    };

    expect(
      getChangedValues<ProductValues>({
        initialData: {
          settings: {
            description: 'All shoes',
            title: 'Footwear',
          },
        },
        submitData: {
          settings: {
            title: 'Footwear',
          },
        },
      })
    ).toEqual(expectedChanges);
  });

  it('keeps non-plain objects as complete changed values', () => {
    const initialDate = new Date('2026-01-01T00:00:00.000Z');
    const submitDate = new Date('2026-01-02T00:00:00.000Z');

    expect(
      getChangedValues({
        initialData: {
          scheduledAt: initialDate,
        },
        submitData: {
          scheduledAt: submitDate,
        },
      })
    ).toEqual({
      scheduledAt: submitDate,
    });
  });

  it('includes a complete changed array', () => {
    expect(
      getChangedValues({
        initialData: {
          tags: ['running', 'shoes'],
        },
        submitData: {
          tags: ['running', 'footwear'],
        },
      })
    ).toEqual({
      tags: ['running', 'footwear'],
    });
  });

  it('omits an unchanged array', () => {
    expect(
      getChangedValues({
        initialData: {
          tags: [{ id: 1, name: 'Running' }],
        },
        submitData: {
          tags: [{ id: 1, name: 'Running' }],
        },
      })
    ).toBeUndefined();
  });
});
