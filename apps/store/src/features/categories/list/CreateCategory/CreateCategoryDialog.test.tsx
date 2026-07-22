import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createCategory, getCategories } from '@/lib/client/api/categories';
import { categoriesQueryKeys } from '@/lib/query/categories/categoriesQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateCategoryDialog } from './CreateCategoryDialog';

const onOpenChangeMock = vi.fn();

vi.mock('@/lib/client/api/categories', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/categories')>(
    '@/lib/client/api/categories'
  )),
  createCategory: vi.fn(),
  getCategories: vi.fn(),
}));

const createCategoryMock = vi.mocked(createCategory);
const getCategoriesMock = vi.mocked(getCategories);

const { setup } = prepareStoreSetup({
  component: CreateCategoryDialog,
  props: {
    onOpenChange: onOpenChangeMock,
    open: true,
  },
});

describe('CreateCategoryDialog', () => {
  beforeEach(() => {
    createCategoryMock.mockReset();
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
        ],
        page: {
          number: 0,
          size: 100,
          totalElements: 1,
          totalPages: 1,
        },
      },
    });
    onOpenChangeMock.mockClear();
  });

  it('requires a category name before create is available', async () => {
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', { name: 'Add new category' });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Name',
    });
    const createButton = within(dialog).getByRole('button', { name: 'Add' });

    expect(createButton).toBeDisabled();

    await user.type(nameField, '   ');
    await user.tab();

    expect(within(dialog).getByText('Category name is required')).toBeVisible();
    expect(createButton).toBeDisabled();

    await user.clear(nameField);
    await user.type(nameField, 'Sneakers');

    expect(createButton).toBeEnabled();
  });

  it('creates a category with the selected parent category', async () => {
    createCategoryMock.mockResolvedValue({
      ok: true,
      data: {
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
      },
    });
    const user = userEvent.setup();
    const { queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const dialog = screen.getByRole('dialog', { name: 'Add new category' });

    await user.type(
      within(dialog).getByRole('textbox', { name: 'Name' }),
      'Sneakers'
    );
    await user.click(
      within(dialog).getByRole('combobox', { name: 'Parent category' })
    );
    await user.click(screen.getByRole('option', { name: 'Shoes' }));
    await user.click(within(dialog).getByRole('button', { name: 'Add' }));

    expect(createCategoryMock).toHaveBeenCalledWith({
      name: 'Sneakers',
      parentId: 1,
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: categoriesQueryKeys.list,
      })
    );
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });

  it('prevents another creation while the request is in flight', async () => {
    let resolveCreate:
      | ((value: Awaited<ReturnType<typeof createCategory>>) => void)
      | undefined;

    createCategoryMock.mockReturnValue(
      new Promise((resolve) => {
        resolveCreate = resolve;
      })
    );
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', { name: 'Add new category' });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Name',
    });

    await user.type(nameField, 'Sneakers');

    const createButton = within(dialog).getByRole('button', { name: 'Add' });

    await user.click(createButton);

    expect(createButton).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Adding...' })).toBeVisible();

    resolveCreate?.({
      ok: true,
      data: {
        id: 3,
        name: 'Sneakers',
        sortOrder: 15,
        color: '#16a34a',
        createdAt: '2026-07-01T11:22:53.562Z',
      },
    });

    await screen.findByRole('button', { name: 'Add' });
  });

  it('shows backend errors and keeps the dialog open when submit fails', async () => {
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
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', { name: 'Add new category' });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Name',
    });

    await user.type(nameField, 'Sneakers');
    await user.click(within(dialog).getByRole('button', { name: 'Add' }));

    expect(createCategoryMock).toHaveBeenCalledWith({
      name: 'Sneakers',
      parentId: null,
    });
    expect(
      await within(dialog).findByText('Category name already exists.')
    ).toBeVisible();
    expect(nameField).toHaveAccessibleDescription(
      'Category name already exists.'
    );
    expect(
      await screen.findByRole('dialog', { name: 'Category creation failed.' })
    ).toBeVisible();
    expect(
      screen.getByRole('dialog', { name: 'Add new category' })
    ).toBeVisible();
    expect(onOpenChangeMock).not.toHaveBeenCalledWith(false);
  });
});
