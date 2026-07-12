import { screen } from '@testing-library/react';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { WarehousesListHeader } from './WarehousesListHeader';

vi.mock('../CreateWarehouse', () => ({
  CreateWarehouseDialogTrigger: () => (
    <button type="button">Add Warehouse</button>
  ),
}));

const { setup } = prepareStoreSetup({
  component: WarehousesListHeader,
});

describe('WarehousesListHeader', () => {
  it('renders the warehouses title and create action', () => {
    setup();

    expect(
      screen.getByRole('heading', { name: 'Warehouses list' })
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Add Warehouse' })).toBeVisible();
  });
});
