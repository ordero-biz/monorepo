import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getWarehouses } from '@/lib/client/api/warehouses';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { prepareStoreSetup } from '@/test/prepareSetup';
import type { WarehousesAsyncComboboxProps } from './types';
import { WarehousesAsyncCombobox } from './WarehousesAsyncCombobox';

const mocks = vi.hoisted(() => ({
  getWarehouses: vi.fn(),
}));

vi.mock('@/lib/client/api/warehouses', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/warehouses')>(
    '@/lib/client/api/warehouses'
  )),
  getWarehouses: mocks.getWarehouses,
}));

const getWarehousesMock = vi.mocked(getWarehouses);

const { setup } = prepareStoreSetup<WarehousesAsyncComboboxProps>({
  component: WarehousesAsyncCombobox,
  props: {
    'aria-label': 'Warehouse',
    placeholder: 'Select warehouse',
  },
});

describe('WarehousesAsyncCombobox', () => {
  beforeEach(() => {
    getWarehousesMock.mockReset();
  });

  it('displays a saved warehouse before loading and retains it after a load error', async () => {
    getWarehousesMock.mockResolvedValue({
      ok: false,
      error: { status: 500, message: 'Unavailable' },
    });
    const user = userEvent.setup();
    const { onValueChange } = setup({
      value: { id: 4, name: 'Main Warehouse', status: WAREHOUSE_STATUS.ACTIVE },
      onValueChange: vi.fn(),
    });
    const input = screen.getByRole('combobox', { name: 'Warehouse' });
    expect(input).toHaveValue('Main Warehouse');
    expect(getWarehousesMock).not.toHaveBeenCalled();
    await user.click(input);
    expect(
      await screen.findByText("We couldn't load warehouses right now.")
    ).toBeVisible();
    await user.keyboard('{Escape}');
    expect(input).toHaveValue('Main Warehouse');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('shows Draft only for draft warehouses', async () => {
    getWarehousesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            address: null,
            phone: null,
            totalItemQuantity: 0,
            totalPrice: 0,
            id: 1,
            name: 'Draft warehouse',
            comment: '',
            status: WAREHOUSE_STATUS.DRAFT,
          },
          {
            address: null,
            phone: null,
            totalItemQuantity: 0,
            totalPrice: 0,
            id: 2,
            name: 'Active warehouse',
            comment: '',
            status: WAREHOUSE_STATUS.ACTIVE,
          },
        ],
        page: {
          number: 0,
          size: 100,
          totalElements: 2,
          totalPages: 1,
        },
      },
    });
    const user = userEvent.setup();

    const { onValueChange } = setup({ onValueChange: vi.fn() });
    await user.click(screen.getByRole('combobox', { name: 'Warehouse' }));

    const draftOption = await screen.findByRole('option', {
      name: /Draft warehouse/,
    });
    const activeOption = screen.getByRole('option', {
      name: /Active warehouse/,
    });

    expect(
      within(draftOption).getByText('Draft', { exact: true })
    ).toBeVisible();
    expect(
      within(activeOption).queryByText('Draft', { exact: true })
    ).toBeNull();
    await user.click(activeOption);
    expect(onValueChange).toHaveBeenCalledWith(
      { id: 2, name: 'Active warehouse', status: WAREHOUSE_STATUS.ACTIVE },
      expect.any(Object)
    );
    expect(screen.getByRole('combobox', { name: 'Warehouse' })).toHaveValue(
      'Active warehouse'
    );
  });
});
