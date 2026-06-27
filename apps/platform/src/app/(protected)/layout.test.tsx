import { render, screen } from '@testing-library/react';
import ProtectedLayout from './layout';

const { requireAuthenticatedRouteMock } = vi.hoisted(() => ({
  requireAuthenticatedRouteMock: vi.fn<() => Promise<void>>(),
}));

vi.mock('@/lib/api/authPageGuard', () => ({
  requireAuthenticatedRoute: requireAuthenticatedRouteMock,
}));

vi.mock('@/lib/hooks/useLogOut', () => ({
  useLogOut: () => ({
    isLoggingOut: false,
    logOut: vi.fn(),
  }),
}));

describe('ProtectedLayout', () => {
  beforeEach(() => {
    requireAuthenticatedRouteMock.mockReset();
  });

  it('checks authentication before rendering the app shell', async () => {
    requireAuthenticatedRouteMock.mockResolvedValue(undefined);

    render(await ProtectedLayout({ children: <div>Protected content</div> }));

    expect(requireAuthenticatedRouteMock).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('complementary')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Platform' })).toBeVisible();
    expect(screen.getByText('Protected content')).toBeVisible();
  });
});
