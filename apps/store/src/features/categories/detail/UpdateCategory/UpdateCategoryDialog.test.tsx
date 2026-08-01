import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getCategories, updateCategory } from '@/lib/client/api/categories';
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
  getCategories: vi.fn(),
}));

const updateCategoryMock = vi.mocked(updateCategory);
const getCategoriesMock = vi.mocked(getCategories);

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
    getCategoriesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Shoes',
            sortOrder: 10,
            color: '#2563eb',
            createdAt: '2026-07-01T10:54:34.839Z',
          },
          category,
        ],
        page: {
          number: 0,
          size: 100,
          totalElements: 2,
          totalPages: 1,
        },
      },
    });
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
      name: 'Running shoes',
      parentId: 1,
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: categoriesQueryKeys.list,
      })
    );
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: categoriesQueryKeys.detail(2),
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: categoriesQueryKeys.children(1),
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onUpdated).toHaveBeenCalled();
  });

  it('disables the category itself as a parent', async () => {
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', { name: 'Edit category' });

    const parentCategoryField = within(dialog).getByRole('combobox', {
      name: 'Parent category',
    });

    await user.clear(parentCategoryField);
    await user.click(parentCategoryField);

    expect(await screen.findByRole('option', { name: 'Shoes' })).toBeVisible();
    expect(
      await screen.findByRole('option', { name: 'Sneakers' })
    ).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders missing editable values as empty strings', () => {
    setup({
      category: {
        ...category,
        name: null,
      } as unknown as typeof category,
    });

    const dialog = screen.getByRole('dialog', { name: 'Edit category' });

    expect(within(dialog).getByRole('textbox', { name: 'Name' })).toHaveValue(
      ''
    );
    expect(within(dialog).getByRole('button', { name: 'Save' })).toBeDisabled();
  });
});
