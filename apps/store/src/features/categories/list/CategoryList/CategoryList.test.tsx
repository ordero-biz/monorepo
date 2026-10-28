import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { deleteCategories, getCategories } from '@/lib/client/api/categories';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CategoryList } from './CategoryList';

const mocks = vi.hoisted(() => ({
  getCategories: vi.fn(),
  pathname: '/products/categories',
  push: vi.fn(),
  searchParams: new URLSearchParams(),
}));

vi.mock('next/navigation', async () => ({
  ...(await vi.importActual<typeof import('next/navigation')>(
    'next/navigation'
  )),
  usePathname: () => mocks.pathname,
  useRouter: () => ({
    push: mocks.push,
  }),
  useSearchParams: () => mocks.searchParams,
}));

vi.mock('@/lib/client/api/categories', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/categories')>(
    '@/lib/client/api/categories'
  )),
  deleteCategories: vi.fn(),
  getCategories: mocks.getCategories,
}));

vi.mock('./CategoryListHeader', () => ({
  CategoryListHeader: () => <div />,
}));

const deleteCategoriesMock = vi.mocked(deleteCategories);
const getCategoriesMock = vi.mocked(getCategories);

const { setup } = prepareStoreSetup({
  component: CategoryList,
});

describe('CategoryList', () => {
  beforeEach(() => {
    deleteCategoriesMock.mockReset();
    getCategoriesMock.mockReset();
    mocks.push.mockReset();
    mocks.searchParams = new URLSearchParams();
  });

  it('renders a loading state while categories are loading', () => {
    getCategoriesMock.mockReturnValue(new Promise(() => {}));

    setup();

    expect(screen.getByText('Loading categories...')).toBeVisible();
  });

  it('renders an error state and retries loading categories', async () => {
    getCategoriesMock
      .mockResolvedValueOnce({
        ok: false,
        error: {
          status: 500,
          message: 'Could not load categories.',
        },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: {
          content: [
            {
              id: 1,
              name: 'Shoes',
              sortOrder: 10,
              status: 'ACTIVE',
              createdAt: '2026-07-01T10:54:34.839Z',
              parentCategory: {
                id: 2,
                name: 'Fashion',
                status: 'ACTIVE',
                createdAt: '2026-06-30T10:54:34.839Z',
              },
            },
          ],
          page: {
            size: 10,
            number: 0,
            totalElements: 1,
            totalPages: 1,
          },
        },
      });

    const user = userEvent.setup();

    setup();

    expect(
      await screen.findByText("We couldn't load your categories right now.")
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('Shoes')).toBeVisible();
    expect(getCategoriesMock).toHaveBeenCalledTimes(2);
  });

  it('renders the categories table rows', async () => {
    getCategoriesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Shoes',
            sortOrder: 10,
            status: 'ACTIVE',
            createdAt: '2026-07-01T10:54:34.839Z',
            parentCategory: {
              id: 2,
              name: 'Fashion',
              status: 'ACTIVE',
              createdAt: '2026-06-30T10:54:34.839Z',
            },
          },
        ],
        page: {
          size: 10,
          number: 0,
          totalElements: 1,
          totalPages: 1,
        },
      },
    });

    setup();

    expect(
      await screen.findByRole('table', { name: 'Category list' })
    ).toBeVisible();
    expect(screen.getByText('Shoes')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Fashion' })).toHaveAttribute(
      'href',
      '/products/categories/2'
    );
    expect(screen.getAllByText('Active')).toHaveLength(2);
    expect(screen.getByText('01 Jul 2026')).toBeVisible();
    expect(screen.getByText('1-1 of 1')).toBeVisible();
    expect(
      screen.getAllByRole('columnheader').map((header) => header.textContent)
    ).toEqual([
      '',
      'Name',
      'Status',
      'Parent category',
      'Parent status',
      'Created at',
      '',
    ]);
  });

  it('renders current server page rows without client-side pagination', async () => {
    getCategoriesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 2,
            name: 'Accessories',
            sortOrder: 20,
            status: 'DRAFT',
            createdAt: '2026-07-02T10:54:34.839Z',
            parentCategory: null,
          },
        ],
        page: {
          size: 1,
          number: 1,
          totalElements: 2,
          totalPages: 2,
        },
      },
    });

    setup({
      paginationInput: {
        page: 2,
        size: 1,
      },
    });

    expect(await screen.findByText('Accessories')).toBeVisible();
    expect(screen.getByText('None')).toBeVisible();
    expect(screen.getByText('Draft')).toBeVisible();
    expect(screen.getByText('2-2 of 2')).toBeVisible();
    expect(
      within(
        screen.getByRole('row', {
          name: /Accessories Draft None 02 Jul 2026/,
        })
      ).queryByRole('link', { name: 'None' })
    ).not.toBeInTheDocument();
    expect(
      within(
        screen.getByRole('row', {
          name: /Accessories Draft None 02 Jul 2026/,
        })
      ).queryByText('Active')
    ).not.toBeInTheDocument();
  });

  it('leaves the parent status cell empty when the parent has no status', async () => {
    getCategoriesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 3,
            name: 'Socks',
            sortOrder: 30,
            status: 'DRAFT',
            createdAt: '2026-07-03T10:54:34.839Z',
            parentCategory: {
              id: 4,
              name: 'Clothing',
              createdAt: '2026-06-30T10:54:34.839Z',
            },
          },
        ],
        page: {
          size: 10,
          number: 0,
          totalElements: 1,
          totalPages: 1,
        },
      },
    });

    setup();

    const row = await screen.findByRole('row', {
      name: 'Socks Draft Clothing 03 Jul 2026',
    });

    expect(within(row).getByRole('link', { name: 'Clothing' })).toHaveAttribute(
      'href',
      '/products/categories/4'
    );
    expect(
      within(row)
        .getAllByRole('cell')
        .map((cell) => cell.textContent)
    ).toEqual(['', 'Socks', 'Draft', 'Clothing', '', '03 Jul 2026', '']);
  });

  it('shows bulk delete actions for selected categories', async () => {
    getCategoriesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Shoes',
            sortOrder: 10,
            status: 'ACTIVE',
            createdAt: '2026-07-01T10:54:34.839Z',
            parentCategory: null,
          },
        ],
        page: {
          size: 10,
          number: 0,
          totalElements: 1,
          totalPages: 1,
        },
      },
    });
    const user = userEvent.setup();

    setup();

    await user.click(
      await screen.findByRole('checkbox', { name: 'Select Shoes' })
    );

    expect(screen.getByText('1 selected')).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Clear selection' })
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(
      screen.getByRole('dialog', { name: 'Delete category' })
    ).toHaveTextContent(
      'Are you sure you want to delete the "Shoes" category?'
    );
  });

  it('preserves other selections when deleting from a category row action', async () => {
    getCategoriesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Shoes',
            sortOrder: 10,
            status: 'ACTIVE',
            createdAt: '2026-07-01T10:54:34.839Z',
            parentCategory: null,
          },
          {
            id: 2,
            name: 'Accessories',
            sortOrder: 20,
            status: 'DRAFT',
            createdAt: '2026-07-02T10:54:34.839Z',
            parentCategory: null,
          },
        ],
        page: {
          size: 10,
          number: 0,
          totalElements: 2,
          totalPages: 1,
        },
      },
    });
    deleteCategoriesMock.mockResolvedValue({
      ok: true,
      data: undefined,
    });
    const user = userEvent.setup();

    setup();

    await user.click(
      await screen.findByRole('checkbox', { name: 'Select Accessories' })
    );
    await user.click(screen.getByRole('button', { name: 'Actions for Shoes' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Delete' }));

    await user.click(
      within(screen.getByRole('dialog', { name: 'Delete category' })).getByRole(
        'button',
        { name: 'Delete' }
      )
    );

    expect(deleteCategoriesMock).toHaveBeenCalledWith({
      categoryIds: [1],
    });
    await waitFor(() => expect(screen.getByText('1 selected')).toBeVisible());
  });

  it('selects only categories on the current server page', async () => {
    getCategoriesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Shoes',
            sortOrder: 10,
            status: 'ACTIVE',
            createdAt: '2026-07-01T10:54:34.839Z',
            parentCategory: null,
          },
          {
            id: 2,
            name: 'Accessories',
            sortOrder: 20,
            status: 'DRAFT',
            createdAt: '2026-07-02T10:54:34.839Z',
            parentCategory: null,
          },
        ],
        page: {
          size: 2,
          number: 0,
          totalElements: 3,
          totalPages: 2,
        },
      },
    });
    const user = userEvent.setup();

    setup({
      paginationInput: {
        page: 1,
        size: 2,
      },
    });

    await user.click(
      await screen.findByRole('checkbox', { name: 'Select all categories' })
    );

    expect(screen.getByText('2 selected')).toBeVisible();
    expect(screen.queryByText('3 selected')).not.toBeInTheDocument();
  });

  it('clears selection and closes the dialog before the list refresh finishes', async () => {
    const refresh =
      Promise.withResolvers<Awaited<ReturnType<typeof getCategories>>>();

    getCategoriesMock.mockResolvedValueOnce({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Shoes',
            sortOrder: 10,
            status: 'ACTIVE',
            createdAt: '2026-07-01T10:54:34.839Z',
            parentCategory: null,
          },
        ],
        page: {
          size: 10,
          number: 0,
          totalElements: 1,
          totalPages: 1,
        },
      },
    });
    getCategoriesMock.mockReturnValue(refresh.promise);
    deleteCategoriesMock.mockResolvedValue({
      ok: true,
      data: undefined,
    });
    const user = userEvent.setup();

    setup();

    await user.click(
      await screen.findByRole('checkbox', { name: 'Select Shoes' })
    );
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    await user.click(
      within(screen.getByRole('dialog', { name: 'Delete category' })).getByRole(
        'button',
        { name: 'Delete' }
      )
    );

    expect(deleteCategoriesMock).toHaveBeenCalledWith({
      categoryIds: [1],
    });
    await waitFor(() => expect(getCategoriesMock).toHaveBeenCalledTimes(2));
    await waitFor(() =>
      expect(screen.queryByText('1 selected')).not.toBeInTheDocument()
    );
    expect(
      screen.queryByRole('dialog', { name: 'Delete category' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Select Shoes' })
    ).not.toBeChecked();

    await act(async () => {
      refresh.resolve({
        ok: true,
        data: {
          content: [],
          page: { size: 10, number: 0, totalElements: 0, totalPages: 0 },
        },
      });
    });

    expect(await screen.findByText('No categories found.')).toBeVisible();
  });

  it('preserves selection and the dialog while deletion is pending and after failure', async () => {
    const deletion =
      Promise.withResolvers<Awaited<ReturnType<typeof deleteCategories>>>();

    getCategoriesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Shoes',
            sortOrder: 10,
            status: 'ACTIVE',
            createdAt: '2026-07-01T10:54:34.839Z',
            parentCategory: null,
          },
        ],
        page: {
          size: 10,
          number: 0,
          totalElements: 1,
          totalPages: 1,
        },
      },
    });
    deleteCategoriesMock.mockReturnValue(deletion.promise);
    const user = userEvent.setup();

    setup();

    await user.click(
      await screen.findByRole('checkbox', { name: 'Select Shoes' })
    );
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    await user.click(
      within(screen.getByRole('dialog', { name: 'Delete category' })).getByRole(
        'button',
        { name: 'Delete' }
      )
    );

    expect(deleteCategoriesMock).toHaveBeenCalledWith({
      categoryIds: [1],
    });
    expect(screen.getByText('1 selected')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Deleting...' })).toBeDisabled();

    await act(async () => {
      deletion.resolve({
        ok: false,
        error: { status: 500, message: 'Deletion failed' },
      });
    });

    expect(await screen.findByText('Deletion failed')).toBeVisible();
    const dialog = screen.getByRole('dialog', { name: 'Delete category' });

    expect(dialog).toBeVisible();
    expect(
      within(dialog).getByRole('button', { name: 'Delete' })
    ).toBeEnabled();
    expect(screen.getByText('1 selected')).toBeVisible();
    expect(
      screen.getByRole('checkbox', { name: 'Select Shoes', hidden: true })
    ).toBeChecked();
    expect(getCategoriesMock).toHaveBeenCalledTimes(1);
  });

  it('renders an empty state when there are no categories', async () => {
    getCategoriesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [],
        page: {
          size: 10,
          number: 0,
          totalElements: 0,
          totalPages: 0,
        },
      },
    });

    setup();

    expect(await screen.findByText('No categories found.')).toBeVisible();
  });

  it('requests categories with pagination input', async () => {
    const paginationInput = {
      page: 2,
      size: 10,
      sort: ['name,asc'],
    };

    getCategoriesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [],
        page: {
          size: 10,
          number: 2,
          totalElements: 0,
          totalPages: 0,
        },
      },
    });

    setup({ paginationInput });

    expect(await screen.findByText('No categories found.')).toBeVisible();
    expect(getCategoriesMock).toHaveBeenCalledWith(paginationInput);
  });

  it('pushes pagination changes to the URL', async () => {
    mocks.searchParams = new URLSearchParams('page=1&size=25&sort=name%2Casc');
    getCategoriesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [],
        page: {
          size: 10,
          number: 0,
          totalElements: 51,
          totalPages: 3,
        },
      },
    });

    const user = userEvent.setup();

    setup({
      paginationInput: {
        page: 1,
        size: 10,
        sort: ['name,asc'],
      },
    });

    await user.click(
      await screen.findByRole('button', { name: 'Go to next page' })
    );

    expect(mocks.push).toHaveBeenCalledWith(
      '/products/categories?page=2&size=25&sort=name%2Casc',
      { scroll: false }
    );
  });
});
