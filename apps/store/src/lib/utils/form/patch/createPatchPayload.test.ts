import { createPatchPayload } from './createPatchPayload';

describe('createPatchPayload', () => {
  it('returns undefined when values are unchanged', () => {
    expect(
      createPatchPayload({
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
      createPatchPayload({
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
      createPatchPayload({
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
      createPatchPayload({
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

  it('omits undefined values', () => {
    expect(
      createPatchPayload({
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
      name: 'Running shoes',
    });
  });

  it('includes a complete changed array', () => {
    expect(
      createPatchPayload({
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
      createPatchPayload({
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
