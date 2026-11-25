import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { deleteCategories } from '@/lib/client/api/categories';
import { categoriesQueryKeys } from '@/lib/query/categories/categoriesQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { DeleteCategoriesDialog } from './DeleteCategoriesDialog';

vi.mock('@/lib/client/api/categories', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/categories')>(
    '@/lib/client/api/categories'
  )),
  deleteCategories: vi.fn(),
}));

const deleteCategoriesMock = vi.mocked(deleteCategories);

const singleCategory = {
  id: 7,
  name: 'Shoes',
  sortOrder: 10,
  status: 'DRAFT' as const,
  createdAt: '2026-06-24T20:07:32.467Z',
  parentCategory: {
    id: 3,
    name: 'Fashion',
    createdAt: '2026-06-20T20:07:32.467Z',
  },
};

const multipleCategories = [
  singleCategory,
  {
    id: 8,
    name: 'Accessories',
    sortOrder: 20,
    status: 'ACTIVE' as const,
    createdAt: '2026-06-25T20:07:32.467Z',
    parentCategory: {
      id: 4,
      name: 'Clothing',
      createdAt: '2026-06-21T20:07:32.467Z',
    },
  },
];

const { setup: setupSingle } = prepareStoreSetup({
  component: DeleteCategoriesDialog,
  props: {
    categories: [singleCategory],
    onDeleted: vi.fn(),
    onOpenChange: vi.fn(),
    open: true,
  },
});

const { setup: setupMultiple } = prepareStoreSetup({
  component: DeleteCategoriesDialog,
  props: {
    categories: multipleCategories,
    onDeleted: vi.fn(),
    onOpenChange: vi.fn(),
    open: true,
  },
});

describe('DeleteCategoriesDialog', () => {
  beforeEach(() => {
    deleteCategoriesMock.mockReset();
  });

  it('renders a confirmation dialog with the category name for one category', () => {
    setupSingle();

    const dialog = screen.getByRole('dialog', { name: 'Delete category' });

    expect(dialog).toBeVisible();
    expect(dialog).toHaveTextContent(
      'Are you sure you want to delete the "Shoes" category?'
    );
  });

  it('renders a confirmation dialog with the category count for multiple categories', () => {
    setupMultiple();

    const dialog = screen.getByRole('dialog', { name: 'Delete categories' });

    expect(dialog).toBeVisible();
    expect(dialog).toHaveTextContent(
      'Are you sure you want to delete 2 categories?'
    );
  });

  it('deletes categories, updates affected queries, and closes the dialog', async () => {
    const user = userEvent.setup();
    deleteCategoriesMock.mockResolvedValue({
      ok: true,
      data: undefined,
    });
    const { onDeleted, onOpenChange, queryClient } = setupMultiple();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const removeQueriesSpy = vi.spyOn(queryClient, 'removeQueries');

    multipleCategories.forEach((category) => {
      queryClient.setQueryData(categoriesQueryKeys.children(category.id), []);
    });

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(deleteCategoriesMock).toHaveBeenCalledWith({
      categoryIds: [7, 8],
    });
    expect(removeQueriesSpy).toHaveBeenCalledWith({
      queryKey: categoriesQueryKeys.detail(7),
    });
    expect(removeQueriesSpy).toHaveBeenCalledWith({
      queryKey: categoriesQueryKeys.detail(8),
    });
    multipleCategories.forEach((category) => {
      expect(
        queryClient.getQueryState(categoriesQueryKeys.children(category.id))
      ).toBeUndefined();
    });
    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: categoriesQueryKeys.list,
      });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: categoriesQueryKeys.children(3),
      });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: categoriesQueryKeys.children(4),
      });
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onDeleted).toHaveBeenCalled();
  });

  it('prevents another deletion while the request is in flight', async () => {
    let resolveDelete:
      | ((value: Awaited<ReturnType<typeof deleteCategories>>) => void)
      | undefined;

    deleteCategoriesMock.mockReturnValue(
      new Promise((resolve) => {
        resolveDelete = resolve;
      })
    );
    const user = userEvent.setup();

    setupSingle();

    const deleteButton = screen.getByRole('button', { name: 'Delete' });

    await user.click(deleteButton);

    expect(deleteButton).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Deleting...' })).toBeVisible();

    resolveDelete?.({
      ok: true,
      data: undefined,
    });

    await screen.findByRole('button', { name: 'Delete' });
  });

  it('shows a toast and stays open when deletion fails', async () => {
    const user = userEvent.setup();
    deleteCategoriesMock.mockResolvedValue({
      ok: false,
      error: {
        status: 500,
        message: 'Category delete failed',
      },
    });

    setupSingle();

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(
      await screen.findByRole('dialog', { name: 'Category delete failed' })
    ).toBeVisible();
    expect(
      screen.getByRole('dialog', { name: 'Delete category' })
    ).toBeVisible();
  });
});
