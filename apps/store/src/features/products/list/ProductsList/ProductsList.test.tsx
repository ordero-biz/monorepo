import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getProducts, getProductVariants } from '@/lib/client/api/products';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { PRODUCTS_LIST_MODE } from './constants';
import { ProductsList } from './ProductsList';

const mocks = vi.hoisted(() => ({
  pathname: '/products',
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

vi.mock('@/lib/client/api/products', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/products')>(
    '@/lib/client/api/products'
  )),
  getProductVariants: vi.fn(),
  getProducts: vi.fn(),
}));

const getProductVariantsMock = vi.mocked(getProductVariants);
const getProductsMock = vi.mocked(getProducts);

const productVariant = {
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
};

const productGroup = {
  id: 2,
  name: 'Running Shoes',
  description: 'Lightweight daily trainer',
  createdAt: '2026-07-03T07:20:30.291Z',
  category: {
    id: 2,
    name: 'Footwear',
    createdAt: '2026-07-01T07:20:30.291Z',
  },
};

const { setup } = prepareStoreSetup({
  component: ProductsList,
  props: {
    listMode: PRODUCTS_LIST_MODE.products,
  },
});

describe('ProductsList', () => {
  beforeEach(() => {
    getProductVariantsMock.mockReset();
    getProductsMock.mockReset();
    mocks.push.mockReset();
    mocks.searchParams = new URLSearchParams();
  });

  it('renders a loading state while products are loading', () => {
    getProductVariantsMock.mockReturnValue(new Promise(() => {}));

    setup();

    expect(screen.getByText('Loading products...')).toBeVisible();
    expect(getProductsMock).not.toHaveBeenCalled();
  });

  it('renders an error state and retries loading products', async () => {
    getProductVariantsMock
      .mockResolvedValueOnce({
        ok: false,
        error: {
          status: 500,
          message: 'Could not load products.',
        },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: {
          content: [productVariant],
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
      await screen.findByText("We couldn't load your products right now.")
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('Running Shoes / Blue / 42')).toBeVisible();
    expect(getProductVariantsMock).toHaveBeenCalledTimes(2);
  });

  it('renders product variant table rows by default', async () => {
    getProductVariantsMock.mockResolvedValue({
      ok: true,
      data: {
        content: [productVariant],
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
      await screen.findByRole('table', { name: 'Products list' })
    ).toBeVisible();
    expect(screen.getByText('Running Shoes / Blue / 42')).toBeVisible();
    expect(
      screen.queryByText('Lightweight daily trainer')
    ).not.toBeInTheDocument();
    expect(screen.getByText('RUN-BLU-42')).toBeVisible();
    expect(screen.getByText('1234567890')).toBeVisible();
    expect(screen.getByText('Color: Blue')).toBeVisible();
    expect(screen.getByText('20 Jul 2026')).toBeVisible();
    expect(
      screen.queryByRole('button', { name: /SKU/ })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Barcode/ })
    ).not.toBeInTheDocument();
    expect(getProductsMock).not.toHaveBeenCalled();
  });

  it('renders product group rows when product groups mode is active', async () => {
    getProductsMock.mockResolvedValue({
      ok: true,
      data: {
        content: [productGroup],
        page: {
          size: 10,
          number: 0,
          totalElements: 1,
          totalPages: 1,
        },
      },
    });

    setup({
      listMode: PRODUCTS_LIST_MODE.productGroups,
    });

    expect(await screen.findByText('Running Shoes')).toBeVisible();
    expect(screen.getByText('Lightweight daily trainer')).toBeVisible();
    expect(screen.getByText('Footwear')).toBeVisible();
    expect(screen.getByText('03 Jul 2026')).toBeVisible();
    expect(getProductVariantsMock).not.toHaveBeenCalled();
  });

  it('requests product variants with pagination input', async () => {
    const paginationInput = {
      page: 2,
      size: 10,
      sort: ['name,asc'],
    };

    getProductVariantsMock.mockResolvedValue({
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

    setup({
      paginationInput,
    });

    await waitFor(() => {
      expect(getProductVariantsMock).toHaveBeenCalledWith(paginationInput);
    });
  });

  it('renders current server page rows without client-side pagination', async () => {
    getProductVariantsMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            ...productVariant,
            id: 2,
            name: 'Trail Shoes / Green / 42',
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

    expect(await screen.findByText('Trail Shoes / Green / 42')).toBeVisible();
    expect(screen.getByText('2-2 of 2')).toBeVisible();
  });

  it('renders an empty state when there are no products', async () => {
    getProductVariantsMock.mockResolvedValue({
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

    expect(await screen.findByText('No products found.')).toBeVisible();
  });

  it('pushes pagination changes to the URL', async () => {
    mocks.searchParams = new URLSearchParams('page=0&size=25&sort=name%2Casc');
    getProductVariantsMock.mockResolvedValue({
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
        page: 0,
        size: 10,
        sort: ['name,asc'],
      },
    });

    await user.click(
      await screen.findByRole('button', { name: 'Go to next page' })
    );

    expect(mocks.push).toHaveBeenCalledWith(
      '/products?page=1&size=25&sort=name%2Casc',
      { scroll: false }
    );
  });
});
