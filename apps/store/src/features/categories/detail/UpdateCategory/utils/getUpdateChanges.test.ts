import { getCategoryUpdateChanges } from './getUpdateChanges';

const category = {
  id: 2,
  name: 'Sneakers',
  sortOrder: 15,
  createdAt: '2026-07-01T11:22:53.562Z',
  parentCategory: {
    id: 1,
    name: 'Shoes',
    createdAt: '2026-07-01T10:54:34.839Z',
  },
};

describe('getCategoryUpdateChanges', () => {
  it('normalizes form values before creating the update patch', () => {
    expect(
      getCategoryUpdateChanges({
        category,
        formValue: {
          name: ' Running shoes ',
          parentId: null,
        },
      })
    ).toEqual({
      name: 'Running shoes',
      parentId: null,
    });
  });

  it('returns no patch when normalized form values are unchanged', () => {
    expect(
      getCategoryUpdateChanges({
        category,
        formValue: {
          name: ' Sneakers ',
          parentId: '1',
        },
      })
    ).toBeUndefined();
  });
});
