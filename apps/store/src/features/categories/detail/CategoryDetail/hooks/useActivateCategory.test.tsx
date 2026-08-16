import { act, renderHook, waitFor } from '@testing-library/react';
import { updateCategory } from '@/lib/client/api/categories';
import { CATEGORY_STATUS } from '@/lib/domain/categories';
import { categoriesQueryKeys } from '@/lib/query/categories/categoriesQueryKeys';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useActivateCategory } from './useActivateCategory';

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
  updateCategory: vi.fn(),
}));

const updateCategoryMock = vi.mocked(updateCategory);

const setupActivateCategoryHook = () => {
  const onActivated = vi.fn();
  const queryClient = createTestQueryClient();
  const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
  const TestQueryProvider = createTestQueryProvider(queryClient);

  const { result } = renderHook(
    () =>
      useActivateCategory({
        categoryId: 2,
        categoryName: 'Sneakers',
        onActivated,
      }),
    {
      wrapper: TestQueryProvider,
    }
  );

  return {
    invalidateQueriesSpy,
    onActivated,
    result,
  };
};

describe('useActivateCategory', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    updateCategoryMock.mockReset();
  });

  it('activates the category, invalidates queries, shows success toast, and runs onActivated', async () => {
    updateCategoryMock.mockResolvedValue({
      ok: true,
      data: {
        id: 2,
        name: 'Sneakers',
        sortOrder: 15,
        createdAt: '2026-07-01T11:22:53.562Z',
        parentCategory: null,
      },
    });
    const { invalidateQueriesSpy, onActivated, result } =
      setupActivateCategoryHook();

    expect(result.current.isActivating).toBe(false);

    act(() => {
      result.current.handleActivate();
    });

    await waitFor(() =>
      expect(updateCategoryMock).toHaveBeenCalledWith({
        categoryId: 2,
        status: CATEGORY_STATUS.ACTIVE,
      })
    );
    await waitFor(() => expect(onActivated).toHaveBeenCalled());
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: categoriesQueryKeys.list,
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: categoriesQueryKeys.detail(2),
    });
    expect(addToastMock).toHaveBeenCalledWith({
      description: 'Category Sneakers was published',
      type: 'success',
    });
    expect(result.current.isActivating).toBe(false);
  });

  it('shows error toast and skips success callbacks when activation fails', async () => {
    updateCategoryMock.mockResolvedValue({
      ok: false,
      error: {
        status: 500,
        message: 'Could not activate category',
      },
    });
    const { onActivated, result } = setupActivateCategoryHook();

    act(() => {
      result.current.handleActivate();
    });

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Could not activate category',
        type: 'error',
      })
    );
    expect(onActivated).not.toHaveBeenCalled();
    expect(result.current.isActivating).toBe(false);
  });
});
