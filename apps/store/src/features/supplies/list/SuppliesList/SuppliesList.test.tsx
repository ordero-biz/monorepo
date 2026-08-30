import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getSupplies } from '@/lib/client/api/supplies';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { SuppliesList } from './SuppliesList';

const mocks = vi.hoisted(() => ({
  pathname: '/products/supplies',
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

vi.mock('@/lib/client/api/supplies', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/supplies')>(
    '@/lib/client/api/supplies'
  )),
  getSupplies: vi.fn(),
}));

const getSuppliesMock = vi.mocked(getSupplies);

const { setup } = prepareStoreSetup({
  component: SuppliesList,
});

describe('SuppliesList', () => {
  beforeEach(() => {
    getSuppliesMock.mockReset();
    mocks.push.mockReset();
    mocks.searchParams = new URLSearchParams();
  });

  it('renders a loading state while supplies are loading', () => {
    getSuppliesMock.mockReturnValue(new Promise(() => {}));

    setup();

    expect(screen.getByText('Loading supplies...')).toBeVisible();
  });

  it('renders an error state and retries loading supplies', async () => {
    getSuppliesMock
      .mockResolvedValueOnce({
        ok: false,
        error: {
          status: 500,
          message: 'Could not load supplies.',
        },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: {
          content: [
            {
              id: 1,
              supplier: {
                id: 5,
                name: 'Fresh Farms',
              },
              warehouse: {
                id: 7,
                name: 'Central warehouse',
              },
              status: 'DRAFT',
              comment: 'Internal note',
              completedAt: null,
              completedBy: null,
              supplyNumber: 'SUP-001',
              supplierInvoiceNumber: 'INV-001',
              totalQuantity: 50,
              totalPrice: 1200.5,
              createdAt: '2026-08-01T17:26:52.128Z',
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
      await screen.findByText("We couldn't load your supplies right now.")
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('SUP-001')).toBeVisible();
    expect(getSuppliesMock).toHaveBeenCalledTimes(2);
  });

  it('renders the supplies table rows without the comment column', async () => {
    getSuppliesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            supplier: {
              id: 5,
              name: 'Fresh Farms',
            },
            warehouse: {
              id: 7,
              name: 'Central warehouse',
            },
            status: 'DRAFT',
            comment: 'Internal note',
            completedAt: null,
            completedBy: null,
            supplyNumber: 'SUP-001',
            supplierInvoiceNumber: 'INV-001',
            totalQuantity: 50,
            totalPrice: 1200.5,
            createdAt: '2026-08-01T17:26:52.128Z',
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
      await screen.findByRole('table', { name: 'Supplies list' })
    ).toBeVisible();
    expect(screen.getByText('SUP-001')).toBeVisible();
    expect(screen.getByText('Fresh Farms')).toBeVisible();
    expect(screen.getByText('Central warehouse')).toBeVisible();
    expect(screen.getByText('Invoice number')).toBeVisible();
    expect(screen.getByText('Draft')).toBeVisible();
    expect(screen.getByText('1,200.5')).toBeVisible();
    expect(screen.getByText('01 Aug 2026')).toBeVisible();
    expect(screen.queryByText('Comment')).not.toBeInTheDocument();
    expect(screen.queryByText('Internal note')).not.toBeInTheDocument();
  });

  it('requests supplies with pagination input', async () => {
    const paginationInput = {
      page: 2,
      size: 10,
      sort: ['createdAt,desc'],
    };

    getSuppliesMock.mockResolvedValue({
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
      expect(getSuppliesMock).toHaveBeenCalledWith(paginationInput);
    });
  });

  it('renders current server page rows without client-side pagination', async () => {
    getSuppliesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 2,
            supplier: {
              id: 6,
              name: 'Harvest Goods',
            },
            warehouse: {
              id: 8,
              name: 'East warehouse',
            },
            status: 'COMPLETED',
            comment: 'Delivered',
            completedAt: '2026-08-02T10:00:00.000Z',
            completedBy: 'Jane Smith',
            supplyNumber: 'SUP-002',
            supplierInvoiceNumber: 'INV-002',
            totalQuantity: 80,
            totalPrice: 2000,
            createdAt: '2026-08-01T17:26:52.128Z',
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

    expect(await screen.findByText('SUP-002')).toBeVisible();
    expect(screen.getByText('2-2 of 2')).toBeVisible();
  });

  it('renders an empty state when there are no supplies', async () => {
    getSuppliesMock.mockResolvedValue({
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

    expect(await screen.findByText('No supplies found.')).toBeVisible();
  });

  it('pushes pagination changes to the URL', async () => {
    mocks.searchParams = new URLSearchParams(
      'page=1&size=25&sort=createdAt%2Cdesc'
    );
    getSuppliesMock.mockResolvedValue({
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
        sort: ['createdAt,desc'],
      },
    });

    await user.click(
      await screen.findByRole('button', { name: 'Go to next page' })
    );

    expect(mocks.push).toHaveBeenCalledWith(
      '/products/supplies?page=2&size=25&sort=createdAt%2Cdesc',
      { scroll: false }
    );
  });
});
