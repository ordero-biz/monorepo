import { render, screen } from '@testing-library/react';
import { categoriesQueryKeys } from '@/lib/query/categories/categoriesQueryKeys';
import { getServerCategories } from '@/lib/server/api/categories';
import type { PaginationSearchInput } from '@/lib/utils/url';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import CategoriesPage from './page';

const categoryListMock = vi.hoisted(() => vi.fn());

vi.mock('@/features/categories', async () => ({
  ...(await vi.importActual<typeof import('@/features/categories')>(
    '@/features/categories'
  )),
  CategoryList: (props: { paginationInput?: PaginationSearchInput }) => {
    categoryListMock(props);

    return <div>Category list</div>;
  },
}));

vi.mock('@/lib/server/api/categories', () => ({
  getServerCategories: vi.fn(),
}));

const getServerCategoriesMock = vi.mocked(getServerCategories);

describe('CategoriesPage', () => {
  beforeEach(() => {
    getServerCategoriesMock.mockReset();
    categoryListMock.mockReset();
  });

  it('prefetches categories and hydrates the query cache', async () => {
    const categories = {
      content: [
        {
          id: 1,
          name: 'Shoes',
          sortOrder: 10,
          color: '#2563eb',
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
    };
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);

    getServerCategoriesMock.mockResolvedValue({
      ok: true,
      data: categories,
    });

    render(await CategoriesPage(), {
      wrapper: TestQueryProvider,
    });

    expect(screen.getByText('Category list')).toBeVisible();
    expect(getServerCategoriesMock).toHaveBeenCalledWith({
      page: 0,
      size: 10,
    });
    expect(categoryListMock).toHaveBeenCalledWith({
      paginationInput: {
        page: 0,
        size: 10,
      },
    });
    expect(
      queryClient.getQueryData(
        categoriesQueryKeys.listPage({
          page: 0,
          size: 10,
        })
      )
    ).toEqual(categories);
  });

  it('prefetches categories with pagination from the URL search params', async () => {
    const categories = {
      content: [],
      page: {
        size: 10,
        number: 2,
        totalElements: 0,
        totalPages: 0,
      },
    };
    const paginationInput = {
      page: 2,
      size: 10,
      sort: ['name,asc', 'sortOrder,desc'],
    };
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);

    getServerCategoriesMock.mockResolvedValue({
      ok: true,
      data: categories,
    });

    render(
      await CategoriesPage({
        searchParams: Promise.resolve({
          page: '2',
          size: '10',
          sort: ['name,asc', 'sortOrder,desc'],
        }),
      }),
      {
        wrapper: TestQueryProvider,
      }
    );

    expect(getServerCategoriesMock).toHaveBeenCalledWith(paginationInput);
    expect(categoryListMock).toHaveBeenCalledWith({
      paginationInput,
    });
    expect(
      queryClient.getQueryData(categoriesQueryKeys.listPage(paginationInput))
    ).toEqual(categories);
  });
});
