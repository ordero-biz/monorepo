import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getSuppliers } from '@/lib/client/api/suppliers';
import { SUPPLIER_STATUS } from '@/lib/domain/suppliers/constants';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { SuppliersAsyncCombobox } from './SuppliersAsyncCombobox';
import type { SuppliersAsyncComboboxProps } from './types';

const mocks = vi.hoisted(() => ({
  getSuppliers: vi.fn(),
}));

vi.mock('@/lib/client/api/suppliers', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/suppliers')>(
    '@/lib/client/api/suppliers'
  )),
  getSuppliers: mocks.getSuppliers,
}));

const getSuppliersMock = vi.mocked(getSuppliers);

const { setup } = prepareStoreSetup<SuppliersAsyncComboboxProps>({
  component: SuppliersAsyncCombobox,
  props: {
    'aria-label': 'Supplier',
    placeholder: 'Select supplier',
  },
});

describe('SuppliersAsyncCombobox', () => {
  beforeEach(() => {
    getSuppliersMock.mockReset();
  });

  it('shows Draft only for draft suppliers', async () => {
    getSuppliersMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          { id: 1, name: 'Draft supplier', status: SUPPLIER_STATUS.DRAFT },
          { id: 2, name: 'Active supplier', status: SUPPLIER_STATUS.ACTIVE },
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
    await user.click(screen.getByRole('combobox', { name: 'Supplier' }));

    const draftOption = await screen.findByRole('option', {
      name: /Draft supplier/,
    });
    const activeOption = screen.getByRole('option', {
      name: /Active supplier/,
    });

    expect(
      within(draftOption).getByText('Draft', { exact: true })
    ).toBeVisible();
    expect(
      within(activeOption).queryByText('Draft', { exact: true })
    ).toBeNull();
  });
});
