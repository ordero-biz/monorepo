import { render, screen } from '@testing-library/react';
import { productsQueryKeys } from '@/lib/query/products/productsQueryKeys';
import { getServerProducts } from '@/lib/server/api/products';
import type { PaginationSearchInput } from '@/lib/utils/url';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import ProductsPage from './page';

const productsListMock = vi.hoisted(() => vi.fn());

vi.mock('@/features/products', async () => ({
  ...(await vi.importActual<typeof import('@/features/products')>(
    '@/features/products'
  )),
  ProductsList: (props: { paginationInput?: PaginationSearchInput }) => {
    productsListMock(props);

    return <div>Products list</div>;
  },
  ProductsListHeader: () => <div>Products header</div>,
}));

vi.mock('@/lib/server/api/products', () => ({
  getServerProducts: vi.fn(),
}));

const getServerProductsMock = vi.mocked(getServerProducts);

describe('ProductsPage', () => {
  beforeEach(() => {
    getServerProductsMock.mockReset();
    productsListMock.mockReset();
  });

  it('prefetches products and hydrates the query cache', async () => {
    const products = {
      content: [
        {
          id: 1,
          name: 'Running Shoes',
          description: 'Lightweight daily trainer',
          createdAt: '2026-07-03T07:20:30.291Z',
          category: {
            id: 2,
            name: 'Footwear',
            createdAt: '2026-07-01T07:20:30.291Z',
          },
        },
      ],
      page: {
        size: 25,
        number: 0,
        totalElements: 1,
        totalPages: 1,
      },
    };
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);

    getServerProductsMock.mockResolvedValue({
      ok: true,
      data: products,
    });

    render(await ProductsPage(), {
      wrapper: TestQueryProvider,
    });

    expect(screen.getByText('Products header')).toBeVisible();
    expect(screen.getByText('Products list')).toBeVisible();
    expect(getServerProductsMock).toHaveBeenCalledWith({
      page: 0,
      size: 25,
    });
    expect(productsListMock).toHaveBeenCalledWith({
      paginationInput: {
        page: 0,
        size: 25,
      },
    });
    expect(
      queryClient.getQueryData(
        productsQueryKeys.listPage({
          page: 0,
          size: 25,
        })
      )
    ).toEqual(products);
  });

  it('prefetches products with pagination from the URL search params', async () => {
    const products = {
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
      sort: ['name,asc', 'createdAt,desc'],
    };
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);

    getServerProductsMock.mockResolvedValue({
      ok: true,
      data: products,
    });

    render(
      await ProductsPage({
        searchParams: Promise.resolve({
          page: '2',
          size: '10',
          sort: ['name,asc', 'createdAt,desc'],
        }),
      }),
      {
        wrapper: TestQueryProvider,
      }
    );

    expect(getServerProductsMock).toHaveBeenCalledWith(paginationInput);
    expect(productsListMock).toHaveBeenCalledWith({
      paginationInput,
    });
    expect(
      queryClient.getQueryData(productsQueryKeys.listPage(paginationInput))
    ).toEqual(products);
  });
});
