import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getCategories } from '@/lib/client/api/categories';
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
  getCategories: mocks.getCategories,
}));

vi.mock('./CategoryListHeader', () => ({
  CategoryListHeader: () => <div />,
}));

const getCategoriesMock = vi.mocked(getCategories);

const { setup } = prepareStoreSetup({
  component: CategoryList,
});

describe('CategoryList', () => {
  beforeEach(() => {
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
    expect(screen.getByText('Fashion')).toBeVisible();
    expect(screen.getByText('Active')).toBeVisible();
    expect(screen.getByText('01 Jul 2026')).toBeVisible();
    expect(screen.getByText('1-1 of 1')).toBeVisible();
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
        page: 1,
        size: 1,
      },
    });

    expect(await screen.findByText('Accessories')).toBeVisible();
    expect(screen.getByText('None')).toBeVisible();
    expect(screen.getByText('Draft')).toBeVisible();
    expect(screen.getByText('2-2 of 2')).toBeVisible();
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
