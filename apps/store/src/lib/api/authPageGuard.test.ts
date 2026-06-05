import { hasAuthenticatedServerSession as resolveAuthenticatedServerSession } from '@ordero/next-api/authPageGuard';
import { getServerSession } from '@/lib/api/session';
import { hasAuthenticatedServerSession } from './authPageGuard';

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
});
