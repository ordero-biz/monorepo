import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Supplier } from '@/lib/domain/suppliers';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { SupplierDetailHeader } from './SupplierDetailHeader';

vi.mock('@/features/suppliers/detail/UpdateSupplier', () => ({
  UpdateSupplierDialogTrigger: ({
    onUpdated,
    supplier,
  }: {
    onUpdated: () => Promise<void> | void;
    supplier: Supplier;
  }) => (
    <button onClick={() => void onUpdated()} type="button">
      Edit {supplier.name}
    </button>
  ),
}));

const { setup } = prepareStoreSetup({
  component: SupplierDetailHeader,
  props: {
    onUpdated: vi.fn(),
    supplier: {
      id: 1,
      name: 'Fresh Farms',
      email: 'orders@fresh.example',
      phone: '+1 555 0100',
      address: '123 Market St',
      comment: 'Preferred produce supplier',
    },
  },
});

describe('SupplierDetailHeader', () => {
  it('renders the supplier name and edit action', async () => {
    const user = userEvent.setup();
    const { onUpdated } = setup();

    expect(screen.getByRole('heading', { name: 'Fresh Farms' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Edit Fresh Farms' }));

    await waitFor(() => expect(onUpdated).toHaveBeenCalled());
  });
});
