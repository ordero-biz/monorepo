import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getCategories } from '@/lib/client/api/categories';
import { categoriesQueryKeys } from '@/lib/query/categories/categoriesQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CategoriesAsyncCombobox } from './CategoriesAsyncCombobox';

const mocks = vi.hoisted(() => ({
  getCategories: vi.fn(),
  onValueChange: vi.fn(),
}));

vi.mock('@/lib/client/api/categories', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/categories')>(
    '@/lib/client/api/categories'
  )),
  getCategories: mocks.getCategories,
}));

const getCategoriesMock = vi.mocked(getCategories);

const { setup } = prepareStoreSetup({
  component: CategoriesAsyncCombobox,
  props: {
    'aria-label': 'Category',
    onValueChange: mocks.onValueChange,
    placeholder: 'Select category',
  },
});

describe('CategoriesAsyncCombobox', () => {
  beforeEach(() => {
    getCategoriesMock.mockReset();
    mocks.onValueChange.mockReset();
  });

  const mockSuccessfulCategories = () => {
    getCategoriesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            color: '#2563eb',
            createdAt: '2026-07-01T10:54:34.839Z',
            id: 1,
            name: 'Shoes',
            sortOrder: 10,
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
  };

  it('calls onValueChange when the user picks a category', async () => {
    const user = userEvent.setup();

    mockSuccessfulCategories();

    setup();

    await user.click(screen.getByRole('combobox', { name: 'Category' }));
    await user.click(await screen.findByRole('option', { name: 'Shoes' }));

    expect(getCategoriesMock).toHaveBeenCalledWith({
      page: 0,
      size: 100,
      sort: ['name,asc'],
    });
    expect(mocks.onValueChange).toHaveBeenLastCalledWith(
      '1',
      expect.any(Object)
    );
  });

  it('refetches when category list queries are invalidated', async () => {
    const user = userEvent.setup();

    mockSuccessfulCategories();
    const { queryClient } = setup();

    await user.click(screen.getByRole('combobox', { name: 'Category' }));

    await waitFor(() => expect(getCategoriesMock).toHaveBeenCalledTimes(1));

    await queryClient.invalidateQueries({
      queryKey: categoriesQueryKeys.list,
    });

    await waitFor(() => expect(getCategoriesMock).toHaveBeenCalledTimes(2));
  });

  it('shows an empty state when no categories are available', async () => {
    getCategoriesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [],
        page: {
          number: 0,
          size: 100,
          totalElements: 0,
          totalPages: 0,
        },
      },
    });
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('combobox', { name: 'Category' }));

    expect(await screen.findByText('No categories found')).toBeVisible();
  });

  it('shows a load error when categories cannot be retrieved', async () => {
    getCategoriesMock.mockResolvedValue({
      ok: false,
      error: {
        status: 500,
        message: 'Could not load categories.',
      },
    });
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('combobox', { name: 'Category' }));

    expect(
      await screen.findByText("We couldn't load categories right now.")
    ).toBeVisible();
  });
});
