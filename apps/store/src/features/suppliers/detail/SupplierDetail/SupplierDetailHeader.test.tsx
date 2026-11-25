import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { clientRoutes } from '@/lib/client/routes';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { SupplierDetailHeader } from './SupplierDetailHeader';

const { setup } = prepareStoreSetup({
  component: SupplierDetailHeader,
  props: {
    supplier: {
      id: 1,
      name: 'Fresh Farms',
      status: 'DRAFT' as 'ACTIVE' | 'DRAFT',
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

    setup();

    expect(screen.getByRole('heading', { name: 'Fresh Farms' })).toBeVisible();
    const breadcrumbs = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(
      within(breadcrumbs).getByRole('link', { name: 'Suppliers' })
    ).toHaveAttribute('href', clientRoutes.suppliers);
    expect(within(breadcrumbs).getByText('Fresh Farms')).toHaveAttribute(
      'aria-current',
      'page'
    );

    await user.click(
      screen.getByRole('button', { name: 'Actions for Fresh Farms' })
    );
    await user.click(
      await screen.findByRole('menuitem', { name: 'Edit supplier' })
    );

    expect(screen.getByRole('dialog', { name: 'Edit supplier' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue(
      'Fresh Farms'
    );
  });

  it('opens a confirmation dialog before publishing a draft supplier', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Publish' }));

    expect(
      screen.getByRole('dialog', { name: 'Publish supplier' })
    ).toBeVisible();
    expect(
      screen.getByText(
        'This action cannot be undone. However, you will still be able to update contact details and comments.'
      )
    ).toBeVisible();
  });

  it('shows edit actions but not Publish for an active supplier', async () => {
    const user = userEvent.setup();

    setup({
      supplier: {
        id: 1,
        name: 'Fresh Farms',
        status: 'ACTIVE',
        email: 'orders@fresh.example',
        phone: '+1 555 0100',
        address: '123 Market St',
        comment: 'Preferred produce supplier',
      },
    });

    expect(
      screen.queryByRole('button', { name: 'Publish' })
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Actions for Fresh Farms' })
    );

    expect(
      await screen.findByRole('menuitem', { name: 'Edit supplier' })
    ).toBeVisible();
  });
});
