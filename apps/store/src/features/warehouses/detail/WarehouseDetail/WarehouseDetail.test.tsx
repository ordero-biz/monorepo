import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getWarehouse } from '@/lib/client/api/warehouses';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses';
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
  name: 'Main Warehouse',
  status: WAREHOUSE_STATUS.DRAFT,
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
    expect(screen.getByText('Draft')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Publish' })).toBeVisible();
    expect(screen.getByText('123 Commerce Ave')).toBeVisible();
    expect(screen.getByText('Primary stock location')).toBeVisible();
  });

  it('shows an Active badge and hides edit actions for active warehouses', async () => {
    getWarehouseMock.mockResolvedValue({
      ok: true,
      data: { ...warehouse, status: WAREHOUSE_STATUS.ACTIVE },
    });

    setup();

    expect(await screen.findByText('Active')).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Actions for Main Warehouse' })
    ).not.toBeInTheDocument();
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
