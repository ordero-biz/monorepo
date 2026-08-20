import { updateCategory } from '@/lib/client/api/categories';
import { submitUpdateCategory } from './submitAction';

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
});
