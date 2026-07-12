import { clientRoutes } from '@/lib/client/routes';
import { getServerSession } from '@/lib/server/session';
import {
  hasAuthenticatedServerSession,
  requireAuthenticatedRoute,
} from './authPageGuard';

const { redirectMock, resolveAuthenticatedServerSessionMock } = vi.hoisted(
  () => ({
    redirectMock: vi.fn(() => {
      throw new Error('redirect');
    }),
    resolveAuthenticatedServerSessionMock: vi.fn(),
  })
);

vi.mock('next/navigation', async () => ({
  ...(await vi.importActual<typeof import('next/navigation')>(
    'next/navigation'
  )),
  redirect: redirectMock,
}));

vi.mock('@ordero/next-api/authPageGuard', async () => ({
  ...(await vi.importActual<typeof import('@ordero/next-api/authPageGuard')>(
    '@ordero/next-api/authPageGuard'
  )),
  hasAuthenticatedServerSession: resolveAuthenticatedServerSessionMock,
}));

describe('authPageGuard', () => {
  beforeEach(() => {
    redirectMock.mockClear();
    resolveAuthenticatedServerSessionMock.mockReset();
  });

  it.each([
    true,
    false,
  ])('returns %s from authenticated server session checks with the app session lookup', async (authenticated) => {
    resolveAuthenticatedServerSessionMock.mockResolvedValue(authenticated);

    await expect(hasAuthenticatedServerSession()).resolves.toBe(authenticated);
    expect(resolveAuthenticatedServerSessionMock).toHaveBeenCalledWith({
      getServerSession,
    });
  });

  it('redirects signed-out protected route requests to sign in', async () => {
    resolveAuthenticatedServerSessionMock.mockResolvedValue(false);

    await expect(requireAuthenticatedRoute()).rejects.toThrow('redirect');
    expect(redirectMock).toHaveBeenCalledWith(clientRoutes.signIn);
  });

  it('allows authenticated protected route requests to continue', async () => {
    resolveAuthenticatedServerSessionMock.mockResolvedValue(true);

    await expect(requireAuthenticatedRoute()).resolves.toBeUndefined();
    expect(redirectMock).not.toHaveBeenCalled();
  });
});
