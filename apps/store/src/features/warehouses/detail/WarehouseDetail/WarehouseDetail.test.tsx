import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  getWarehouse,
  getWarehouseStock,
  updateWarehouse,
} from '@/lib/client/api/warehouses';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { WarehouseDetail } from './WarehouseDetail';

vi.mock('next/navigation', () => ({
  usePathname: () => '/warehouse/1',
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock('@/lib/client/api/warehouses', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/warehouses')>(
    '@/lib/client/api/warehouses'
  )),
  getWarehouse: vi.fn(),
  getWarehouseStock: vi.fn(),
  updateWarehouse: vi.fn(),
}));

const getWarehouseMock = vi.mocked(getWarehouse);
const updateWarehouseMock = vi.mocked(updateWarehouse);

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
    vi.mocked(getWarehouseStock).mockResolvedValue({
      ok: true,
      data: {
        content: [],
        page: { number: 0, size: 10, totalElements: 0, totalPages: 0 },
      },
    });
    updateWarehouseMock.mockReset();
  });

  it('refreshes the warehouse once after editing', async () => {
    const updatedWarehouse = {
      ...warehouse,
      name: 'Central Warehouse',
      address: '456 Commerce Ave',
    };
    getWarehouseMock
      .mockResolvedValueOnce({ ok: true, data: warehouse })
      .mockResolvedValue({ ok: true, data: updatedWarehouse });
    updateWarehouseMock.mockResolvedValue({ ok: true, data: updatedWarehouse });
    const user = userEvent.setup();

    setup();

    await user.click(
      await screen.findByRole('button', { name: 'Actions for Main Warehouse' })
    );
    await user.click(
      await screen.findByRole('menuitem', { name: 'Edit warehouse' })
    );

    const dialog = screen.getByRole('dialog', { name: 'Edit warehouse' });
    const nameField = within(dialog).getByRole('textbox', { name: 'Name' });

    await user.clear(nameField);
    await user.type(nameField, 'Central Warehouse');
    const addressField = within(dialog).getByRole('textbox', {
      name: 'Address',
    });

    await user.clear(addressField);
    await user.type(addressField, '456 Commerce Ave');
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(
      await screen.findByRole('heading', { name: 'Central Warehouse' })
    ).toBeVisible();
    expect(screen.getByText('456 Commerce Ave')).toBeVisible();
    expect(
      screen.queryByRole('dialog', { name: 'Edit warehouse' })
    ).not.toBeInTheDocument();
    expect(updateWarehouseMock).toHaveBeenCalledExactlyOnceWith({
      warehouseId: 1,
      name: 'Central Warehouse',
      address: '456 Commerce Ave',
    });
    expect(getWarehouseMock).toHaveBeenCalledTimes(2);
  });

  it('refreshes the warehouse once after publishing', async () => {
    const activeWarehouse = { ...warehouse, status: WAREHOUSE_STATUS.ACTIVE };
    getWarehouseMock
      .mockResolvedValueOnce({ ok: true, data: warehouse })
      .mockResolvedValue({ ok: true, data: activeWarehouse });
    updateWarehouseMock.mockResolvedValue({ ok: true, data: activeWarehouse });
    const user = userEvent.setup();

    setup();

    await user.click(await screen.findByRole('button', { name: 'Publish' }));
    await user.click(
      within(
        screen.getByRole('dialog', { name: 'Publish warehouse' })
      ).getByRole('button', { name: 'Publish' })
    );

    expect(await screen.findByText('Active')).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Publish' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('dialog', { name: 'Publish warehouse' })
    ).not.toBeInTheDocument();
    expect(updateWarehouseMock).toHaveBeenCalledExactlyOnceWith({
      warehouseId: 1,
      status: WAREHOUSE_STATUS.ACTIVE,
    });
    expect(getWarehouseMock).toHaveBeenCalledTimes(2);
  });

  it('renders warehouse details', async () => {
    getWarehouseMock.mockResolvedValue({ ok: true, data: warehouse });

    setup();

    expect(
      await screen.findByRole('heading', { name: 'Main Warehouse' })
    ).toBeVisible();
    expect(screen.getByText('Warehouse details')).toBeVisible();
    expect(
      await screen.findByRole('table', { name: 'Warehouse products' })
    ).toBeVisible();
    expect(screen.getByText('Draft')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Publish' })).toBeVisible();
    expect(screen.getByText('123 Commerce Ave')).toBeVisible();
    expect(screen.getByText('Primary stock location')).toBeVisible();
  });

  it('shows edit actions but not Publish for an active warehouse', async () => {
    getWarehouseMock.mockResolvedValue({
      ok: true,
      data: { ...warehouse, status: WAREHOUSE_STATUS.ACTIVE },
    });

    setup();

    expect(await screen.findByText('Active')).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Publish' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Actions for Main Warehouse' })
    ).toBeVisible();
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
