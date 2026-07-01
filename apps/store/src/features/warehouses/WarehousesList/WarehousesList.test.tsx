import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getWarehouses } from '@/lib/client/api/warehouses';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { WarehousesList } from './WarehousesList';

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
              code: 'WH-001',
              name: 'Main Warehouse',
              address: '123 Commerce Ave',
              comment: 'Primary stock location',
            },
          ],
          page: {
            size: 25,
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
            code: 'WH-001',
            name: 'Main Warehouse',
            address: '123 Commerce Ave',
            comment: 'Primary stock location',
          },
        ],
        page: {
          size: 25,
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
    expect(screen.getByText('WH-001')).toBeVisible();
    expect(screen.getByText('Main Warehouse')).toBeVisible();
    expect(screen.getByText('123 Commerce Ave')).toBeVisible();
    expect(screen.getByText('Primary stock location')).toBeVisible();
  });
});
