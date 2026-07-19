import { createCategory } from '@/lib/client/api/categories';
import { submitCreateCategory } from './submitAction';

vi.mock('@/lib/client/api/categories', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/categories')>(
    '@/lib/client/api/categories'
  )),
  createCategory: vi.fn(),
}));

const createCategoryMock = vi.mocked(createCategory);

describe('submitCreateCategory', () => {
  beforeEach(() => {
    createCategoryMock.mockReset();
  });

  it('normalizes form values before creating the category', async () => {
    const category = {
      id: 3,
      name: 'Sneakers',
      sortOrder: 15,
      color: '#16a34a',
      createdAt: '2026-07-01T11:22:53.562Z',
      parentCategory: {
        id: 1,
        name: 'Shoes',
        createdAt: '2026-07-01T10:54:34.839Z',
      },
    };
    createCategoryMock.mockResolvedValue({
      ok: true,
      data: category,
    });

    await expect(
      submitCreateCategory({
        color: ' #16a34a ',
        name: '  Sneakers  ',
        parentId: '1',
        sortOrder: '15',
      })
    ).resolves.toEqual({
      ok: true,
      data: category,
    });

    expect(createCategoryMock).toHaveBeenCalledWith({
      color: '#16a34a',
      name: 'Sneakers',
      parentId: 1,
      sortOrder: 15,
    });
  });

  it('maps backend errors to submit action errors', async () => {
    createCategoryMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Category creation failed.',
        fieldErrors: {
          name: 'Category name already exists.',
        },
      },
    });

    await expect(
      submitCreateCategory({
        color: '#16a34a',
        name: 'Sneakers',
        parentId: '1',
        sortOrder: '15',
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        fieldErrors: {
          name: 'Category name already exists.',
        },
        formError: 'Category creation failed.',
      },
    });
  });

  it('sends parent id null when no parent category is selected', async () => {
    const category = {
      id: 3,
      name: 'Sneakers',
      sortOrder: 15,
      color: '#16a34a',
      createdAt: '2026-07-01T11:22:53.562Z',
    };
    createCategoryMock.mockResolvedValue({
      ok: true,
      data: category,
    });

    await expect(
      submitCreateCategory({
        color: '#16a34a',
        name: 'Sneakers',
        parentId: null,
        sortOrder: '15',
      })
    ).resolves.toEqual({
      ok: true,
      data: category,
    });

    expect(createCategoryMock).toHaveBeenCalledWith({
      color: '#16a34a',
      name: 'Sneakers',
      parentId: null,
      sortOrder: 15,
    });
  });
});
