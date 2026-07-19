import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { updateCategory } from '@/lib/client/api/categories';
import { categoriesQueryKeys } from '@/lib/query/categories/categoriesQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { UpdateCategoryDialog } from './UpdateCategoryDialog';

const onOpenChangeMock = vi.fn();
const onUpdatedMock = vi.fn();

vi.mock('@/lib/client/api/categories', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/categories')>(
    '@/lib/client/api/categories'
  )),
  updateCategory: vi.fn(),
}));

const updateCategoryMock = vi.mocked(updateCategory);

const category = {
  id: 2,
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

const { setup } = prepareStoreSetup({
  component: UpdateCategoryDialog,
  props: {
    availableCategories: [
      category,
      {
        id: 1,
        name: 'Shoes',
        sortOrder: 10,
        color: '#2563eb',
        createdAt: '2026-07-01T10:54:34.839Z',
      },
    ],
    category,
    onOpenChange: onOpenChangeMock,
    onUpdated: onUpdatedMock,
    open: true,
  },
});

describe('UpdateCategoryDialog', () => {
  beforeEach(() => {
    onOpenChangeMock.mockClear();
    onUpdatedMock.mockClear();
    updateCategoryMock.mockReset();
  });

  it('updates a category, closes, and refreshes category caches', async () => {
    updateCategoryMock.mockResolvedValue({
      ok: true,
      data: { ...category, name: 'Running shoes' },
    });
    const user = userEvent.setup();
    const { onOpenChange, onUpdated, queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const dialog = screen.getByRole('dialog', { name: 'Edit category' });
    const nameField = within(dialog).getByRole('textbox', { name: 'Name' });

    await user.clear(nameField);
    await user.type(nameField, ' Running shoes ');
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(updateCategoryMock).toHaveBeenCalledWith({
      categoryId: 2,
      color: '#16a34a',
      name: 'Running shoes',
      parentId: 1,
      sortOrder: 15,
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: categoriesQueryKeys.list,
      })
    );
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: categoriesQueryKeys.detail(2),
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onUpdated).toHaveBeenCalled();
  });

  it('does not offer the category itself as a parent', async () => {
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', { name: 'Edit category' });

    await user.click(
      within(dialog).getByRole('combobox', { name: 'Parent category' })
    );

    expect(screen.getByRole('option', { name: 'Shoes' })).toBeVisible();
    expect(
      screen.queryByRole('option', { name: 'Sneakers' })
    ).not.toBeInTheDocument();
  });
});
