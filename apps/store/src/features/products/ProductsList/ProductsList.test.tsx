import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getProducts } from '@/lib/client/api/products';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { ProductsList } from './ProductsList';

const mocks = vi.hoisted(() => ({
  pathname: '/products',
  push: vi.fn(),
  searchParams: new URLSearchParams(),
}));

vi.mock('next/navigation', () => ({
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
  getProducts: vi.fn(),
}));

const getProductsMock = vi.mocked(getProducts);

const { setup } = prepareStoreSetup({
  component: ProductsList,
});

describe('ProductsList', () => {
  beforeEach(() => {
    getProductsMock.mockReset();
    mocks.push.mockReset();
    mocks.searchParams = new URLSearchParams();
  });

  it('renders a loading state while products are loading', () => {
    getProductsMock.mockReturnValue(new Promise(() => {}));

    setup();

    expect(screen.getByText('Loading products...')).toBeVisible();
  });

  it('renders an error state and retries loading products', async () => {
    getProductsMock
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

    expect(await screen.findByText('Running Shoes')).toBeVisible();
    expect(getProductsMock).toHaveBeenCalledTimes(2);
  });

  it('renders the products table rows', async () => {
    getProductsMock.mockResolvedValue({
      ok: true,
      data: {
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
    expect(screen.getByText('Running Shoes')).toBeVisible();
    expect(screen.getByText('Lightweight daily trainer')).toBeVisible();
    expect(screen.getByText('Footwear')).toBeVisible();
    expect(screen.getByText('03 Jul 2026')).toBeVisible();
  });

  it('requests products with pagination input', async () => {
    const paginationInput = {
      page: 2,
      size: 10,
      sort: ['name,asc'],
    };

    getProductsMock.mockResolvedValue({
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
      expect(getProductsMock).toHaveBeenCalledWith(paginationInput);
    });
  });

  it('renders current server page rows without client-side pagination', async () => {
    getProductsMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 2,
            name: 'Trail Shoes',
            description: 'Stable off-road trainer',
            createdAt: '2026-07-04T07:20:30.291Z',
            category: {
              id: 2,
              name: 'Footwear',
              createdAt: '2026-07-01T07:20:30.291Z',
            },
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

    expect(await screen.findByText('Trail Shoes')).toBeVisible();
    expect(screen.getByText('2-2 of 2')).toBeVisible();
  });
});
