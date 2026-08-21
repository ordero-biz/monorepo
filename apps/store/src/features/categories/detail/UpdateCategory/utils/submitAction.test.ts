import { updateCategory } from '@/lib/client/api/categories';
import { API_ERROR_CODES } from '@/lib/constants/apiErrorCodes';
import { getCategoryUpdateChanges, submitUpdateCategory } from './submitAction';

vi.mock('@/lib/client/api/categories', () => ({
  updateCategory: vi.fn(),
}));

const updateCategoryMock = vi.mocked(updateCategory);

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

describe('submitUpdateCategory', () => {
  beforeEach(() => {
    updateCategoryMock.mockReset();
  });

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

  it('transfers prepared category update data', async () => {
    updateCategoryMock.mockResolvedValue({
      ok: true,
      data: { ...category, parentCategory: undefined },
    });

    await submitUpdateCategory({
      categoryId: category.id,
      submitData: { parentId: null },
    });

    expect(updateCategoryMock).toHaveBeenCalledWith({
      categoryId: 2,
      parentId: null,
    });
  });

  it('maps active category modification errors for the form', async () => {
    updateCategoryMock.mockResolvedValue({
      ok: false,
      error: {
        status: 409,
        code: API_ERROR_CODES.CATEGORY_MODIFICATION_NOT_ALLOWED,
        message: 'Conflict',
      },
    });

    await expect(
      submitUpdateCategory({
        categoryId: category.id,
        submitData: { name: 'Running shoes' },
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        fieldErrors: undefined,
        formError: 'Active categories cannot be edited',
      },
    });
  });
});
