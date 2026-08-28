import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getWarehouses } from '@/lib/client/api/warehouses';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { WarehousesList } from './WarehousesList';

const mocks = vi.hoisted(() => ({
  pathname: '/products/warehouse',
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

vi.mock('@/lib/client/api/warehouses', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/warehouses')>(
    '@/lib/client/api/warehouses'
  )),
  getWarehouses: vi.fn(),
}));

const getWarehousesMock = vi.mocked(getWarehouses);

const { setup } = prepareStoreSetup({
  component: WarehousesList,
});

describe('WarehousesList', () => {
  beforeEach(() => {
    getWarehousesMock.mockReset();
    mocks.push.mockReset();
    mocks.searchParams = new URLSearchParams();
  });

  it('renders a loading state while warehouses are loading', () => {
    getWarehousesMock.mockReturnValue(new Promise(() => {}));

    setup();

    expect(screen.getByText('Loading warehouses...')).toBeVisible();
  });

  it('renders an error state and retries loading warehouses', async () => {
    getWarehousesMock
      .mockResolvedValueOnce({
        ok: false,
        error: {
          status: 500,
          message: 'Could not load warehouses.',
        },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: {
          content: [
            {
              id: 1,
              name: 'Main Warehouse',
              address: '123 Commerce Ave',
              comment: 'Primary stock location',
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
      await screen.findByText("We couldn't load your warehouses right now.")
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('Main Warehouse')).toBeVisible();
    expect(getWarehousesMock).toHaveBeenCalledTimes(2);
  });

  it('renders the warehouses table rows', async () => {
    getWarehousesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Main Warehouse',
            status: WAREHOUSE_STATUS.DRAFT,
            address: '123 Commerce Ave',
            comment: 'Primary stock location',
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
      await screen.findByRole('table', { name: 'Warehouses list' })
    ).toBeVisible();
    expect(
      screen.getByRole('link', { name: 'Main Warehouse' })
    ).toHaveAttribute('href', '/products/warehouse/1');
    expect(screen.getByText('Draft')).toBeVisible();
    expect(screen.getByText('123 Commerce Ave')).toBeVisible();
    expect(screen.getByText('Primary stock location')).toBeVisible();
  });

  it('requests warehouses with pagination input', async () => {
    const paginationInput = {
      page: 2,
      size: 10,
      sort: ['name,asc'],
    };

    getWarehousesMock.mockResolvedValue({
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
      expect(getWarehousesMock).toHaveBeenCalledWith(paginationInput);
    });
  });

  it('renders the current server page without client-side pagination', async () => {
    getWarehousesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 2,
            name: 'Overflow Warehouse',
            address: '124 Commerce Ave',
            comment: 'Overflow stock location',
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

    expect(await screen.findByText('Overflow Warehouse')).toBeVisible();
    expect(screen.getByText('2-2 of 2')).toBeVisible();
  });

  it('renders an empty state when there are no warehouses', async () => {
    getWarehousesMock.mockResolvedValue({
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

    expect(await screen.findByText('No warehouses found.')).toBeVisible();
  });

  it('pushes pagination changes to the URL', async () => {
    mocks.searchParams = new URLSearchParams('page=1&size=25&sort=name%2Casc');
    getWarehousesMock.mockResolvedValue({
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
      '/products/warehouse?page=2&size=25&sort=name%2Casc',
      { scroll: false }
    );
  });
});
