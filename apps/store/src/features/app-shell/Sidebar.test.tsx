import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { Sidebar } from './Sidebar';

const { setup } = prepareStoreSetup({
  component: Sidebar,
});

describe('Sidebar', () => {
  it('renders the store navigation links', async () => {
    const user = userEvent.setup();

    setup();

    const sidebar = screen.getByRole('complementary');

    expect(within(sidebar).getByText('Ordero')).toBeVisible();

    const dashboardLink = within(sidebar).getByRole('link', {
      name: 'Dashboard',
    });

    expect(dashboardLink).toBeVisible();
    expect(dashboardLink).toHaveAttribute('href', '/dashboard');

    await user.click(within(sidebar).getByRole('button', { name: 'Product' }));

    expect(
      within(sidebar).getByRole('link', { name: 'Product' })
    ).toHaveAttribute('href', '/products');
    expect(
      within(sidebar).getByRole('link', { name: 'Categories' })
    ).toHaveAttribute('href', '/products/categories');
    expect(
      within(sidebar).getByRole('link', { name: 'Attributes' })
    ).toHaveAttribute('href', '/products/attributes');
    expect(
      within(sidebar).getByRole('link', { name: 'Warehouse' })
    ).toHaveAttribute('href', '/products/warehouse');
  });
});
