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

  it('shows validation after users submit without a category name', async () => {
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', { name: 'Add new category' });
    const nameField = within(dialog).getByRole('textbox', {
      name: 'Name',
    });
    const createButton = within(dialog).getByRole('button', {
      name: 'Save draft',
    });

    expect(createButton).toBeEnabled();

    await user.click(createButton);

    expect(within(dialog).getByText('Category name is required')).toBeVisible();

    await user.type(nameField, '   ');
    await user.tab();

    expect(within(dialog).getByText('Category name is required')).toBeVisible();
    expect(createButton).toBeEnabled();

    await user.clear(nameField);
    await user.type(nameField, 'Sneakers');

    expect(createButton).toBeEnabled();
  });

  it('shows category status guidance and changes the action for drafts', async () => {
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', { name: 'Add new category' });

    expect(
      within(dialog).getByRole('radiogroup', { name: 'Category status' })
    ).toBeRequired();
    expect(
      within(dialog).getByText(
        'Editable only. Cannot be assigned to products or tracked in analytics. Can be activated later'
      )
    ).toBeVisible();
    expect(
      within(dialog).getByText(
        'Fully functional. Can be assigned to products and tracked in analytics. Cannot be edited after publishing'
      )
    ).toBeVisible();

    await user.click(within(dialog).getByRole('radio', { name: /^Draft\b/ }));

    expect(
      within(dialog).getByRole('button', { name: 'Save draft' })
    ).toBeVisible();
  });

  it('forces Draft when the selected parent category is a draft', async () => {
    getCategoriesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Shoes',
            sortOrder: 10,
            createdAt: '2026-07-01T10:54:34.839Z',
            status: 'DRAFT',
          },
        ],
        page: { number: 0, size: 100, totalElements: 1, totalPages: 1 },
      },
    });
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', { name: 'Add new category' });

    await user.click(within(dialog).getByRole('radio', { name: /^Active\b/ }));
    await user.click(
      within(dialog).getByRole('combobox', { name: 'Parent category' })
    );
    await user.click(await screen.findByRole('option', { name: 'Shoes' }));

    expect(
      within(dialog).getByRole('radio', { name: /^Active\b/ })
    ).toHaveAttribute('aria-disabled', 'true');
    expect(
      within(dialog).getByText(
        'Parent category is a draft. Choose an active parent to enable this'
      )
    ).toBeVisible();
    expect(
      within(dialog).getByRole('button', { name: 'Save draft' })
    ).toBeVisible();
  });

  it('creates a category with the selected parent category', async () => {
    createCategoryMock.mockResolvedValue({
      ok: true,
      data: {
        id: 3,
        name: 'Sneakers',
        sortOrder: 15,
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
    await user.click(screen.getByRole('option', { name: /^Shoes\b/ }));
    await user.click(within(dialog).getByRole('radio', { name: /^Active\b/ }));
    await user.click(within(dialog).getByRole('button', { name: 'Publish' }));

    expect(createCategoryMock).toHaveBeenCalledWith({
      name: 'Sneakers',
      parentId: 1,
      status: 'ACTIVE',
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: categoriesQueryKeys.list,
      })
    );
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: categoriesQueryKeys.children(1),
    });
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
    await user.click(within(dialog).getByRole('radio', { name: /^Active\b/ }));

    const createButton = within(dialog).getByRole('button', {
      name: 'Publish',
    });

    await user.click(createButton);

    expect(createButton).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Publishing...' })).toBeVisible();

    resolveCreate?.({
      ok: true,
      data: {
        id: 3,
        name: 'Sneakers',
        sortOrder: 15,
        createdAt: '2026-07-01T11:22:53.562Z',
      },
    });

    await screen.findByRole('button', { name: 'Save draft' });
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
    await user.click(within(dialog).getByRole('radio', { name: /^Active\b/ }));
    await user.click(within(dialog).getByRole('button', { name: 'Publish' }));

    expect(createCategoryMock).toHaveBeenCalledWith({
      name: 'Sneakers',
      parentId: null,
      status: 'ACTIVE',
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
