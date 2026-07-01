import { render, screen } from '@testing-library/react';
import ProtectedLayout from './layout';

const { requireAuthenticatedRouteMock } = vi.hoisted(() => ({
  requireAuthenticatedRouteMock: vi.fn<() => Promise<void>>(),
}));

vi.mock('@/lib/hooks/auth/useLogOut', () => ({
  useLogOut: () => ({
    isLoggingOut: false,
    logOut: vi.fn(),
  }),
}));

vi.mock('@/lib/server/authPageGuard', () => ({
  requireAuthenticatedRoute: requireAuthenticatedRouteMock,
}));

describe('ProtectedLayout', () => {
  beforeEach(() => {
    requireAuthenticatedRouteMock.mockReset();
  });

  it('checks authentication before rendering the app shell', async () => {
    requireAuthenticatedRouteMock.mockResolvedValue(undefined);

    render(await ProtectedLayout({ children: <div>Store content</div> }));

    expect(requireAuthenticatedRouteMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Store content')).toBeVisible();
  });
});
