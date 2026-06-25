import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { logout } from '@/lib/client/api';
import { authQueryKeys } from '@/lib/hooks/useSessionQuery';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { Sidebar } from './Sidebar';

const routerReplaceMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: routerReplaceMock,
  }),
}));

vi.mock('@/lib/client/api', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api')>(
    '@/lib/client/api'
  )),
  logout: vi.fn(),
}));

const logoutMock = vi.mocked(logout);

const { setup } = prepareStoreSetup({
  component: Sidebar,
});

describe('Sidebar', () => {
  beforeEach(() => {
    logoutMock.mockReset();
    routerReplaceMock.mockClear();
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
      within(sidebar).getByRole('link', { name: 'Warehouse' })
    ).toHaveAttribute('href', '/products/warehouse');
  });

  it('logs out from the footer and redirects to sign in', async () => {
    const user = userEvent.setup();
    logoutMock.mockResolvedValue({
      ok: true,
      data: {
        authenticated: false,
      },
    });

    const { queryClient } = setup();
    queryClient.setQueryData(authQueryKeys.session, {
      authenticated: true,
      user: {
        email: 'admin@gmail.com',
      },
    });

    const sidebar = screen.getByRole('complementary');

    await user.click(within(sidebar).getByRole('button', { name: 'Sign out' }));

    expect(logoutMock).toHaveBeenCalledTimes(1);
    expect(queryClient.getQueryData(authQueryKeys.session)).toStrictEqual({
      authenticated: false,
    });
    expect(routerReplaceMock).toHaveBeenCalledWith('/sign-in');
  });
});
