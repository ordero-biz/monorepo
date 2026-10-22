import { act, renderHook, waitFor } from '@testing-library/react';
import { deleteCategories } from '@/lib/client/api/categories';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useDeleteCategories } from './useDeleteCategories';

const { addToastMock } = vi.hoisted(() => ({
  addToastMock: vi.fn(),
}));

vi.mock('@ordero/ui', async () => ({
  ...(await vi.importActual<typeof import('@ordero/ui')>('@ordero/ui')),
  useToastManager: () => ({
    add: addToastMock,
  }),
}));

vi.mock('@/lib/client/api/categories', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/categories')>(
    '@/lib/client/api/categories'
  )),
  deleteCategories: vi.fn(),
}));

const deleteCategoriesMock = vi.mocked(deleteCategories);

const setupDeleteCategoriesHook = () => {
  const onDeleted = vi.fn();
  const TestQueryProvider = createTestQueryProvider(createTestQueryClient());
  const { result } = renderHook(
    () =>
      useDeleteCategories({
        categoryIds: [7, 8],
        onDeleted,
      }),
    {
      wrapper: TestQueryProvider,
    }
  );

  return {
    result,
    onDeleted,
  };
};

describe('useDeleteCategories', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    deleteCategoriesMock.mockReset();
  });

  it('deletes the categories and runs success cleanup', async () => {
    deleteCategoriesMock.mockResolvedValue({
      ok: true,
      data: undefined,
    });
    const { onDeleted, result } = setupDeleteCategoriesHook();

    expect(result.current.isDeleting).toBe(false);

    act(() => {
      result.current.handleDelete();
    });

    await waitFor(() =>
      expect(deleteCategoriesMock).toHaveBeenCalledWith({
        categoryIds: [7, 8],
      })
    );
    await waitFor(() => expect(onDeleted).toHaveBeenCalled());
    expect(addToastMock).toHaveBeenCalledWith({
      description: '2 categories were deleted.',
      type: 'success',
    });
    expect(result.current.isDeleting).toBe(false);
  });

  it('shows a toast and skips success cleanup when delete fails', async () => {
    deleteCategoriesMock.mockResolvedValue({
      ok: false,
      error: {
        status: 500,
        message: 'Category delete failed',
      },
    });
    const { onDeleted, result } = setupDeleteCategoriesHook();

    act(() => {
      result.current.handleDelete();
    });

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Category delete failed',
        type: 'error',
      })
    );
    expect(onDeleted).not.toHaveBeenCalled();
    expect(result.current.isDeleting).toBe(false);
  });
});
