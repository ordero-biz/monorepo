import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { clientRoutes, getAddTransferRoute } from '@/lib/client/routes';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { prepareStoreSetup } from '@/test/prepareSetup';
import type { WarehouseDetailHeaderProps } from './types';
import { WarehouseDetailHeader } from './WarehouseDetailHeader';

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push, replace: vi.fn() }),
}));

const { setup } = prepareStoreSetup<WarehouseDetailHeaderProps>({
  component: WarehouseDetailHeader,
  props: {
    warehouse: {
      phone: null,
      totalItemQuantity: 0,
      totalPrice: 0,
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

  it('navigates to transfer creation with the current warehouse as source', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(
      screen.getByRole('button', { name: 'Actions for Main Warehouse' })
    );
    await user.click(
      await screen.findByRole('menuitem', { name: 'Create transfer' })
    );

    expect(mocks.push).toHaveBeenCalledWith(getAddTransferRoute(1));
  });

  it('hides transfer creation for a draft warehouse', async () => {
    const user = userEvent.setup();
    setup({
      warehouse: {
        phone: null,
        totalItemQuantity: 0,
        totalPrice: 0,
        id: 1,
        name: 'Main Warehouse',
        status: WAREHOUSE_STATUS.DRAFT,
        address: '123 Commerce Ave',
        comment: 'Primary stock location',
      },
    });

    await user.click(
      screen.getByRole('button', { name: 'Actions for Main Warehouse' })
    );

    expect(
      await screen.findByRole('menuitem', { name: 'Edit warehouse' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('menuitem', { name: 'Create transfer' })
    ).not.toBeInTheDocument();
  });
});
