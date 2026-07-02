import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLogOut } from '@/lib/hooks/auth/useLogOut';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { Sidebar } from './Sidebar';

const logOutMock = vi.fn();

vi.mock('@/lib/hooks/auth/useLogOut', () => ({
  useLogOut: vi.fn(),
}));

const useLogOutMock = vi.mocked(useLogOut);

const { setup } = prepareStoreSetup({
  component: Sidebar,
});

describe('Sidebar', () => {
  beforeEach(() => {
    logOutMock.mockReset();
    useLogOutMock.mockReturnValue({
      isLoggingOut: false,
      logOut: logOutMock,
    });
  });

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
      within(sidebar).getByRole('link', { name: 'Units of measurement' })
    ).toHaveAttribute('href', '/products/units-of-measurement');
    expect(
      within(sidebar).getByRole('link', { name: 'Suppliers' })
    ).toHaveAttribute('href', '/products/suppliers');
    expect(
      within(sidebar).getByRole('link', { name: 'Warehouse' })
    ).toHaveAttribute('href', '/products/warehouse');
  });

  it('calls the logout handler from the footer', async () => {
    const user = userEvent.setup();

    setup();

    const sidebar = screen.getByRole('complementary');

    await user.click(within(sidebar).getByRole('button', { name: 'Sign out' }));

    expect(logOutMock).toHaveBeenCalledTimes(1);
  });

  it('shows the pending sign-out state', () => {
    useLogOutMock.mockReturnValue({
      isLoggingOut: true,
      logOut: logOutMock,
    });

    setup();

    const sidebar = screen.getByRole('complementary');
    const signOutButton = within(sidebar).getByRole('button', {
      name: 'Signing out',
    });

    expect(signOutButton).toBeDisabled();
  });
});
