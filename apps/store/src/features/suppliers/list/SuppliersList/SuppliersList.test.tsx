import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getSuppliers } from '@/lib/client/api/suppliers';
import { getSupplierDetailRoute } from '@/lib/client/routes';
import { SUPPLIER_STATUS } from '@/lib/domain/suppliers/constants';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { SuppliersList } from './SuppliersList';

const mocks = vi.hoisted(() => ({
  pathname: '/products/suppliers',
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

vi.mock('@/lib/client/api/suppliers', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/suppliers')>(
    '@/lib/client/api/suppliers'
  )),
  getSuppliers: vi.fn(),
}));

const getSuppliersMock = vi.mocked(getSuppliers);

const { setup } = prepareStoreSetup({
  component: SuppliersList,
});

describe('SuppliersList', () => {
  beforeEach(() => {
    getSuppliersMock.mockReset();
    mocks.push.mockReset();
    mocks.searchParams = new URLSearchParams();
  });

  it('renders a loading state while suppliers are loading', () => {
    getSuppliersMock.mockReturnValue(new Promise(() => {}));

    setup();

    expect(screen.getByText('Loading suppliers...')).toBeVisible();
  });

  it('renders an error state and retries loading suppliers', async () => {
    getSuppliersMock
      .mockResolvedValueOnce({
        ok: false,
        error: {
          status: 500,
          message: 'Could not load suppliers.',
        },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: {
          content: [
            {
              id: 1,
              name: 'Fresh Farms',
              status: SUPPLIER_STATUS.DRAFT,
              email: 'orders@fresh.example',
              phone: '+1 555 0100',
              address: '123 Market St',
              comment: 'Preferred produce supplier',
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
      await screen.findByText("We couldn't load your suppliers right now.")
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('Fresh Farms')).toBeVisible();
    expect(getSuppliersMock).toHaveBeenCalledTimes(2);
  });

  it('renders the suppliers table rows', async () => {
    getSuppliersMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Fresh Farms',
            status: SUPPLIER_STATUS.DRAFT,
            createdAt: '2026-08-01T10:30:00.000Z',
            email: 'orders@fresh.example',
            phone: '+1 555 0100',
            address: '123 Market St',
            comment: 'Preferred produce supplier',
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
      await screen.findByRole('table', { name: 'Suppliers list' })
    ).toBeVisible();
    expect(screen.getByText('Created at')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Fresh Farms' })).toHaveAttribute(
      'href',
      getSupplierDetailRoute(1)
    );
    expect(screen.getByText('orders@fresh.example')).toBeVisible();
    expect(screen.getByText('01 Aug 2026')).toBeVisible();
    expect(screen.getByText('+1 555 0100')).toBeVisible();
    expect(screen.getByText('123 Market St')).toBeVisible();
    expect(screen.getByText('Preferred produce supplier')).toBeVisible();
  });

  it('renders a dash when a supplier has no created date', async () => {
    getSuppliersMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Fresh Farms',
            status: SUPPLIER_STATUS.DRAFT,
            createdAt: null,
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

    expect(await screen.findByText('-')).toBeVisible();
  });

  it('requests suppliers with pagination input', async () => {
    const paginationInput = {
      page: 2,
      size: 10,
      sort: ['name,asc'],
    };

    getSuppliersMock.mockResolvedValue({
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
      expect(getSuppliersMock).toHaveBeenCalledWith(paginationInput);
    });
  });

  it('renders current server page rows without client-side pagination', async () => {
    getSuppliersMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 2,
            name: 'Harvest Goods',
            status: SUPPLIER_STATUS.DRAFT,
            email: 'orders@harvest.example',
            phone: '+1 555 0101',
            address: '124 Market St',
            comment: 'Dry goods supplier',
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

    expect(await screen.findByText('Harvest Goods')).toBeVisible();
    expect(screen.getByText('2-2 of 2')).toBeVisible();
  });

  it('renders an empty state when there are no suppliers', async () => {
    getSuppliersMock.mockResolvedValue({
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

    expect(await screen.findByText('No suppliers found.')).toBeVisible();
  });

  it('pushes pagination changes to the URL', async () => {
    mocks.searchParams = new URLSearchParams('page=1&size=25&sort=name%2Casc');
    getSuppliersMock.mockResolvedValue({
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
      '/products/suppliers?page=2&size=25&sort=name%2Casc',
      { scroll: false }
    );
  });
});
