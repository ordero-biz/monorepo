import { focusManager } from '@tanstack/react-query';
import { act, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('shows the loading card before opening the form with the source warehouse selected', async () => {
    setup({ sourceWarehouseId: 1 });

    expect(screen.getByText('Loading warehouse...')).toBeVisible();
    expect(
      screen.queryByRole('navigation', { name: 'Breadcrumb' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('form', { name: 'Transfer' })
    ).not.toBeInTheDocument();

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

  it('prompts the user to choose a source warehouse after a failed lookup', async () => {
    const user = userEvent.setup();
    getWarehouseMock.mockResolvedValueOnce({
      ok: false,
      error: { status: 404, message: 'Warehouse not found' },
    });
    setup({ sourceWarehouseId: 42 });

    expect(await screen.findByText('Choose a source warehouse')).toBeVisible();
    expect(screen.getByText('Create transfer')).toBeVisible();
    expect(
      screen.getByRole('navigation', { name: 'Breadcrumb' })
    ).toBeVisible();

    const form = screen.getByRole('form', { name: 'Transfer' });
    const source = within(form).getByRole('combobox', {
      name: /From warehouse/,
    });
    expect(source).toHaveValue('');
    await user.click(source);
    await user.click(
      await screen.findByRole('option', { name: 'Main Warehouse' })
    );
    expect(source).toHaveValue('Main Warehouse');
  });

  it('keeps the manually selected source when the browser tab regains focus', async () => {
    const user = userEvent.setup();
    getWarehouseMock.mockResolvedValueOnce({
      ok: false,
      error: { status: 404, message: 'Warehouse not found' },
    });
    setup({ sourceWarehouseId: 42 });

    const source = await screen.findByRole('combobox', {
      name: /From warehouse/,
    });
    await user.click(source);
    await user.click(
      await screen.findByRole('option', { name: 'Main Warehouse' })
    );

    try {
      act(() => focusManager.setFocused(false));
      await act(async () => focusManager.setFocused(true));

      expect(getWarehouseMock).toHaveBeenCalledTimes(1);
      expect(source).toHaveValue('Main Warehouse');
    } finally {
      focusManager.setFocused(undefined);
    }
  });

  it('allows selecting a source manually without a source warehouse id', async () => {
    const user = userEvent.setup();
    setup();

    const source = screen.getByRole('combobox', { name: /From warehouse/ });
    expect(source).toHaveValue('');
    await user.click(source);
    await user.click(
      await screen.findByRole('option', { name: 'Main Warehouse' })
    );
    expect(source).toHaveValue('Main Warehouse');
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
