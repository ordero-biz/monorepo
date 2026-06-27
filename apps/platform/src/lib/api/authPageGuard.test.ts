import { hasAuthenticatedServerSession as resolveAuthenticatedServerSession } from '@ordero/next-api/authPageGuard';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/api/session';
import { clientRoutes } from '@/lib/client/routes';
import {
  hasAuthenticatedServerSession,
  requireAuthenticatedRoute,
} from './authPageGuard';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('redirect');
  }),
}));

vi.mock('@ordero/next-api/authPageGuard', async () => {
  const actual = await vi.importActual<
    typeof import('@ordero/next-api/authPageGuard')
  >('@ordero/next-api/authPageGuard');

  return {
    ...actual,
    hasAuthenticatedServerSession: vi.fn(),
  };
});

vi.mock('@/lib/api/session', async () => {
  const actual =
    await vi.importActual<typeof import('@/lib/api/session')>(
      '@/lib/api/session'
    );

  return {
    ...actual,
    getServerSession: vi.fn(),
  };
});

const resolveAuthenticatedServerSessionMock = vi.mocked(
  resolveAuthenticatedServerSession
);

describe('authPageGuard', () => {
  beforeEach(() => {
    vi.mocked(redirect).mockClear();
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
    expect(redirect).toHaveBeenCalledWith(clientRoutes.signIn);
  });

  it('allows authenticated protected route requests to continue', async () => {
    resolveAuthenticatedServerSessionMock.mockResolvedValue(true);

    await expect(requireAuthenticatedRoute()).resolves.toBeUndefined();
    expect(redirect).not.toHaveBeenCalled();
  });
});
