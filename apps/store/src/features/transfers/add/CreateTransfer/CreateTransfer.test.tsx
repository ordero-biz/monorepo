import { screen, within } from '@testing-library/react';
import { getWarehouse, getWarehouses } from '@/lib/client/api/warehouses';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateTransfer } from './CreateTransfer';
import type { CreateTransferProps } from './types';

vi.mock('@/lib/client/api/warehouses', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/warehouses')>(
    '@/lib/client/api/warehouses'
  )),
  getWarehouse: vi.fn(),
  getWarehouses: vi.fn(),
}));

const getWarehouseMock = vi.mocked(getWarehouse);
const getWarehousesMock = vi.mocked(getWarehouses);

const warehouse = {
  id: 1,
  name: 'Main Warehouse',
  address: '14 Holovna St',
  comment: '',
  phone: null,
  status: WAREHOUSE_STATUS.ACTIVE,
  totalItemQuantity: 0,
  totalPrice: 0,
};

const { setup } = prepareStoreSetup<CreateTransferProps>({
  component: CreateTransfer,
});

describe('CreateTransfer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getWarehouseMock.mockResolvedValue({ ok: true, data: warehouse });
    getWarehousesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [warehouse],
        page: { number: 0, size: 100, totalElements: 1, totalPages: 1 },
      },
    });
  });

  it('preselects the source warehouse when opened from a warehouse', async () => {
    setup({ sourceWarehouseId: 1 });

    expect(
      await screen.findByRole('combobox', { name: /From warehouse/ })
    ).toHaveValue('Main Warehouse');
    expect(screen.getByRole('combobox', { name: /To warehouse/ })).toHaveValue(
      ''
    );
    expect(
      within(screen.getByRole('navigation', { name: 'Breadcrumb' })).getByRole(
        'link',
        { name: 'Main Warehouse' }
      )
    ).toHaveAttribute('href', '/warehouse/1');
  });

  it('leaves the source warehouse empty without a source warehouse id', async () => {
    setup();

    expect(
      await screen.findByRole('combobox', { name: /From warehouse/ })
    ).toHaveValue('');
    expect(getWarehouseMock).not.toHaveBeenCalled();
  });

  it('does not render a save action yet', async () => {
    setup();

    await screen.findByRole('form', { name: 'Transfer' });
    expect(
      screen.queryByRole('button', { name: /save/i })
    ).not.toBeInTheDocument();
  });
});
