import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getProducts, getProductVariants } from '@/lib/client/api/products';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { ProductsListView } from './ProductsListView';

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

const { setup } = prepareStoreSetup({
  component: ProductsListView,
});

describe('ProductsListView', () => {
  beforeEach(() => {
    getProductVariantsMock.mockReset();
    getProductsMock.mockReset();
    mocks.push.mockReset();
    mocks.searchParams = new URLSearchParams();
  });

  it('switches from product variants to product groups', async () => {
    getProductVariantsMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Running Shoes / Blue / 42',
            description: 'Lightweight daily trainer',
            sku: 'RUN-BLU-42',
            barcode: '1234567890',
            createdAt: '2026-07-20T18:23:01.675Z',
            productVariantAttributeValues: [],
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
    getProductsMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 2,
            name: 'Running Shoes',
            description: 'Lightweight daily trainer',
            createdAt: '2026-07-03T07:20:30.291Z',
            category: {
              id: 3,
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

    expect(await screen.findByText('Running Shoes / Blue / 42')).toBeVisible();
    expect(getProductsMock).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Products Groups' }));

    expect(await screen.findByText('Running Shoes')).toBeVisible();
    expect(screen.getByText('Footwear')).toBeVisible();
    expect(getProductsMock).toHaveBeenCalledTimes(1);
  });
});
