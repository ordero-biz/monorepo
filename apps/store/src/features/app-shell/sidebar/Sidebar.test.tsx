import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLogOut } from '@/lib/hooks/auth/useLogOut';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { Sidebar } from './Sidebar';

const mocks = vi.hoisted(() => ({
  logOut: vi.fn(),
  pathname: '/dashboard',
}));

vi.mock('next/navigation', () => ({
  usePathname: () => mocks.pathname,
}));

vi.mock('@/lib/hooks/auth/useLogOut', () => ({
  useLogOut: vi.fn(),
}));

const useLogOutMock = vi.mocked(useLogOut);

const { setup } = prepareStoreSetup({
  component: Sidebar,
});

describe('Store sidebar', () => {
  beforeEach(() => {
    mocks.logOut.mockReset();
    mocks.pathname = '/dashboard';
    useLogOutMock.mockReturnValue({
      isLoggingOut: false,
      logOut: mocks.logOut,
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
    expect(dashboardLink).toHaveAttribute('aria-current', 'page');

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

  it('opens and highlights the parent branch for the most specific active route', () => {
    mocks.pathname = '/products/categories/42';

    setup();

    const sidebar = screen.getByRole('complementary');
    const productBranch = within(sidebar).getByRole('button', {
      name: 'Product',
    });
    const categoryLink = within(sidebar).getByRole('link', {
      name: 'Categories',
    });

    expect(productBranch).toHaveAttribute('aria-expanded', 'true');
    expect(categoryLink).toHaveAttribute('aria-current', 'page');
    expect(
      within(sidebar).getByRole('link', { name: 'Product' })
    ).not.toHaveAttribute('aria-current');
  });

  it('lets users collapse the active branch without clearing route activity', async () => {
    const user = userEvent.setup();
    mocks.pathname = '/products/categories';

    setup();

    const sidebar = screen.getByRole('complementary');
    const productBranch = within(sidebar).getByRole('button', {
      name: 'Product',
    });

    await user.click(productBranch);

    expect(productBranch).toHaveAttribute('aria-expanded', 'false');
    expect(
      within(sidebar).queryByRole('link', { name: 'Categories' })
    ).not.toBeInTheDocument();
  });

  it('calls the logout handler from the footer', async () => {
    const user = userEvent.setup();

    setup();

    const sidebar = screen.getByRole('complementary');

    await user.click(within(sidebar).getByRole('button', { name: 'Sign out' }));

    expect(mocks.logOut).toHaveBeenCalledTimes(1);
  });

  it('shows the pending sign-out state', () => {
    useLogOutMock.mockReturnValue({
      isLoggingOut: true,
      logOut: mocks.logOut,
    });

    setup();

    const sidebar = screen.getByRole('complementary');
    const signOutButton = within(sidebar).getByRole('button', {
      name: 'Signing out',
    });

    expect(signOutButton).toBeDisabled();
  });
});
