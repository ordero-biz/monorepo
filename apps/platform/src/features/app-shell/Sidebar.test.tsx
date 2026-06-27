import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { clientRoutes } from '@/lib/client/routes';
import { useLogOut } from '@/lib/hooks/useLogOut';
import { preparePlatformSetup } from '@/test/prepareSetup';
import { Sidebar } from './Sidebar';

const logOutMock = vi.fn();

vi.mock('@/lib/hooks/useLogOut', () => ({
  useLogOut: vi.fn(),
}));

const useLogOutMock = vi.mocked(useLogOut);

const { setup } = preparePlatformSetup({
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

  it('renders the platform navigation links', () => {
    setup();

    const sidebar = screen.getByRole('complementary');

    expect(within(sidebar).getByText('Ordero')).toBeVisible();
    expect(
      within(sidebar).getByRole('link', { name: 'Stores' })
    ).toHaveAttribute('href', clientRoutes.stores);
    expect(
      within(sidebar).getByRole('link', { name: 'Add store' })
    ).toHaveAttribute('href', clientRoutes.addStore);
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
