import { screen, within } from '@testing-library/react';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { SuppliersListHeader } from './SuppliersListHeader';

vi.mock('@/features/suppliers/list/CreateSupplier', () => ({
  CreateSupplierDialogTrigger: () => (
    <button type="button">Add Supplier</button>
  ),
}));

const { setup } = prepareStoreSetup({
  component: SuppliersListHeader,
});

describe('SuppliersListHeader', () => {
  it('renders the suppliers title and create action', () => {
    setup();

    expect(
      screen.getByRole('heading', { name: 'Suppliers list' })
    ).toBeVisible();
    expect(
      within(screen.getByRole('navigation', { name: 'Breadcrumb' })).getByText(
        'Suppliers'
      )
    ).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Add Supplier' })).toBeVisible();
  });
});
