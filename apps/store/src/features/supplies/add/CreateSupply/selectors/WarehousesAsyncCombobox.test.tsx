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

  it('shows Draft only for draft warehouses', async () => {
    getWarehousesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Draft warehouse',
            comment: '',
            status: WAREHOUSE_STATUS.DRAFT,
          },
          {
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

    setup();
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
  });
});
