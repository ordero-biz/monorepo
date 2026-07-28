import { render, screen } from '@testing-library/react';
import { PRODUCTS_LIST_MODE } from '@/lib/domain/products/constants';
import {
  productGroupsQueryKeys,
  productVariantsQueryKeys,
} from '@/lib/query/products/productsQueryKeys';
import {
  getServerProductGroups,
  getServerProductVariants,
} from '@/lib/server/api/products';
import type { PaginationSearchInput } from '@/lib/utils/url';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import ProductsPage from './page';

const productsListViewMock = vi.hoisted(() => vi.fn());

vi.mock('@/features/products', async () => ({
  ...(await vi.importActual<typeof import('@/features/products')>(
    '@/features/products'
  )),
  ProductsListView: (props: { paginationInput?: PaginationSearchInput }) => {
    productsListViewMock(props);

    return <div>Products list view</div>;
  },
}));

vi.mock('@/lib/server/api/products', () => ({
  getServerProductGroups: vi.fn(),
  getServerProductVariants: vi.fn(),
}));

const getServerProductGroupsMock = vi.mocked(getServerProductGroups);
const getServerProductVariantsMock = vi.mocked(getServerProductVariants);

describe('ProductsPage', () => {
  beforeEach(() => {
    getServerProductGroupsMock.mockReset();
    getServerProductVariantsMock.mockReset();
    productsListViewMock.mockReset();
  });

  it('prefetches product variants and hydrates the query cache', async () => {
    const productVariants = {
      content: [
        {
          id: 1,
          name: 'Running Shoes / Blue / 42',
          description: 'Lightweight daily trainer',
          sku: 'RUN-BLU-42',
          barcode: '1234567890',
          createdAt: '2026-07-20T18:23:01.675Z',
          productVariantAttributeValues: [
            {
              id: 1,
              attribute: {
                id: 2,
                name: 'Color',
                sortOrder: 1,
                createdAt: '2026-07-20T18:23:01.675Z',
              },
              attributeValue: {
                id: 3,
                name: 'Blue',
                sortOrder: 1,
                createdAt: '2026-07-20T18:23:01.675Z',
              },
            },
          ],
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

    getServerProductVariantsMock.mockResolvedValue({
      ok: true,
      data: productVariants,
    });

    render(await ProductsPage(), {
      wrapper: TestQueryProvider,
    });

    expect(screen.getByText('Products list view')).toBeVisible();
    expect(getServerProductVariantsMock).toHaveBeenCalledWith({
      page: 0,
      size: 10,
    });
    expect(productsListViewMock).toHaveBeenCalledWith({
      paginationInput: {
        page: 0,
        size: 10,
      },
    });
    expect(
      queryClient.getQueryData(
        productVariantsQueryKeys.listPage({
          page: 0,
          size: 10,
        })
      )
    ).toEqual(productVariants);
  });

  it('prefetches product variants with pagination from the URL search params', async () => {
    const productVariants = {
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

    getServerProductVariantsMock.mockResolvedValue({
      ok: true,
      data: productVariants,
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

    expect(getServerProductVariantsMock).toHaveBeenCalledWith(paginationInput);
    expect(productsListViewMock).toHaveBeenCalledWith({
      paginationInput,
    });
    expect(
      queryClient.getQueryData(
        productVariantsQueryKeys.listPage(paginationInput)
      )
    ).toEqual(productVariants);
  });

  it('prefetches product groups when requested by the URL search params', async () => {
    const productGroups = {
      content: [],
      page: {
        size: 10,
        number: 0,
        totalElements: 0,
        totalPages: 0,
      },
    };
    const paginationInput = {
      page: 0,
      size: 10,
    };
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);

    getServerProductGroupsMock.mockResolvedValue({
      ok: true,
      data: productGroups,
    });

    render(
      await ProductsPage({
        searchParams: Promise.resolve({
          listMode: PRODUCTS_LIST_MODE.productGroups,
        }),
      }),
      {
        wrapper: TestQueryProvider,
      }
    );

    expect(getServerProductGroupsMock).toHaveBeenCalledWith(paginationInput);
    expect(getServerProductVariantsMock).not.toHaveBeenCalled();
    expect(
      queryClient.getQueryData(productGroupsQueryKeys.listPage(paginationInput))
    ).toEqual(productGroups);
  });
});
