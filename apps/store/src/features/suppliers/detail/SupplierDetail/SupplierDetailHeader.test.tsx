import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { SupplierDetailHeader } from './SupplierDetailHeader';

vi.mock('../UpdateSupplier/UpdateSupplierDialog', () => ({
  UpdateSupplierDialog: ({
    open,
    onUpdated,
  }: {
    open: boolean;
    onUpdated: () => Promise<void> | void;
  }) =>
    open ? (
      <button onClick={() => void onUpdated()} type="button">
        Save supplier
      </button>
    ) : null,
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
  it('opens the edit action from the actions menu', async () => {
    const user = userEvent.setup();
    const { onUpdated } = setup();

    expect(screen.getByRole('heading', { name: 'Fresh Farms' })).toBeVisible();

    await user.click(
      screen.getByRole('button', { name: 'Actions for Fresh Farms' })
    );
    await user.click(screen.getByRole('menuitem', { name: 'Edit supplier' }));
    await user.click(screen.getByRole('button', { name: 'Save supplier' }));

    await waitFor(() => expect(onUpdated).toHaveBeenCalled());
  });
});
