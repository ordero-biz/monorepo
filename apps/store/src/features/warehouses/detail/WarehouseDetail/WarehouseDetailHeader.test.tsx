import { screen, within } from '@testing-library/react';
import { clientRoutes } from '@/lib/client/routes';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { WarehouseDetailHeader } from './WarehouseDetailHeader';

const { setup } = prepareStoreSetup({
  component: WarehouseDetailHeader,
  props: {
    onUpdated: vi.fn(),
    warehouse: {
      id: 1,
      name: 'Main Warehouse',
      status: WAREHOUSE_STATUS.ACTIVE,
      address: '123 Commerce Ave',
      comment: 'Primary stock location',
    },
  },
});

describe('WarehouseDetailHeader', () => {
  it('renders the linked warehouse ancestor and current warehouse breadcrumb', () => {
    setup();

    const breadcrumbs = screen.getByRole('navigation', { name: 'Breadcrumb' });

    expect(
      within(breadcrumbs).getByRole('link', { name: 'Warehouses' })
    ).toHaveAttribute('href', clientRoutes.warehouses);
    expect(within(breadcrumbs).getByText('Main Warehouse')).toHaveAttribute(
      'aria-current',
      'page'
    );
  });
});
