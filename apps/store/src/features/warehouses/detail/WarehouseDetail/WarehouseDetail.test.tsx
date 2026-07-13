import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getWarehouse } from '@/lib/client/api/warehouses';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { WarehouseDetail } from './WarehouseDetail';

vi.mock('@/lib/client/api/warehouses', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/warehouses')>(
    '@/lib/client/api/warehouses'
  )),
  getWarehouse: vi.fn(),
}));

const getWarehouseMock = vi.mocked(getWarehouse);

const { setup } = prepareStoreSetup({
  component: WarehouseDetail,
  props: {
    warehouseId: '1',
  },
});

const warehouse = {
  id: 1,
  code: 'WH-001',
  name: 'Main Warehouse',
  address: '123 Commerce Ave',
  comment: 'Primary stock location',
};

describe('WarehouseDetail', () => {
  beforeEach(() => {
    getWarehouseMock.mockReset();
  });

  it('renders warehouse details', async () => {
    getWarehouseMock.mockResolvedValue({ ok: true, data: warehouse });

    setup();

    expect(
      await screen.findByRole('heading', { name: 'Main Warehouse' })
    ).toBeVisible();
    expect(screen.getByText('Warehouse details')).toBeVisible();
    expect(screen.getByText('WH-001')).toBeVisible();
    expect(screen.getByText('123 Commerce Ave')).toBeVisible();
    expect(screen.getByText('Primary stock location')).toBeVisible();
  });

  it('renders an error state and retries loading the warehouse', async () => {
    getWarehouseMock
      .mockResolvedValueOnce({
        ok: false,
        error: { status: 500, message: 'Could not load warehouse.' },
      })
      .mockResolvedValueOnce({ ok: true, data: warehouse });
    const user = userEvent.setup();

    setup();

    expect(
      await screen.findByText("We couldn't load this warehouse right now.")
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    await waitFor(() => expect(getWarehouseMock).toHaveBeenCalledTimes(2));
  });
});
