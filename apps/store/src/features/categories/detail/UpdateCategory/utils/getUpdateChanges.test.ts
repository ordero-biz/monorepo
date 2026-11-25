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
          parentCategory: null,
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
          parentCategory: { id: 1, name: 'Renamed shoes', status: 'ACTIVE' },
        },
      })
    ).toBeUndefined();
  });

  it('sends only the numeric ID when choosing another parent', () => {
    expect(
      getCategoryUpdateChanges({
        category,
        formValue: {
          name: category.name,
          parentCategory: { id: 3, name: 'Clothing', status: 'DRAFT' },
        },
      })
    ).toEqual({ parentId: 3 });
  });

  it('sends null when clearing the parent category', () => {
    expect(
      getCategoryUpdateChanges({
        category,
        formValue: {
          name: 'Sneakers',
          parentCategory: null,
        },
      })
    ).toEqual({ parentId: null });
  });
});
