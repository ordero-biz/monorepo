import { act, renderHook } from '@testing-library/react';
import { logout } from '@/lib/client/api';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useLogOut } from './useLogOut';
import { authQueryKeys } from './useSessionQuery';

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

describe('useLogOut', () => {
  beforeEach(() => {
    logoutMock.mockReset();
    routerReplaceMock.mockClear();
  });

  it('clears cached data and redirects to sign in after logout succeeds', async () => {
    logoutMock.mockResolvedValue({
      ok: true,
      data: {
        authenticated: false,
      },
    });
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(authQueryKeys.session, {
      authenticated: true,
      user: {
        email: 'admin@gmail.com',
      },
    });
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useLogOut(), {
      wrapper: TestQueryProvider,
    });

    await act(async () => {
      await result.current.logOut();
    });

    expect(logoutMock).toHaveBeenCalledTimes(1);
    expect(queryClient.getQueryData(authQueryKeys.session)).toStrictEqual({
      authenticated: false,
    });
    expect(routerReplaceMock).toHaveBeenCalledWith('/sign-in');
  });

  it('keeps the user on the current page when logout fails', async () => {
    logoutMock.mockResolvedValue({
      ok: false,
      error: {
        status: 500,
        message: 'Unable to sign out.',
      },
    });
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(authQueryKeys.session, {
      authenticated: true,
    });
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useLogOut(), {
      wrapper: TestQueryProvider,
    });

    await act(async () => {
      await result.current.logOut();
    });

    expect(queryClient.getQueryData(authQueryKeys.session)).toStrictEqual({
      authenticated: true,
    });
    expect(result.current.isLoggingOut).toBe(false);
    expect(routerReplaceMock).not.toHaveBeenCalled();
  });
});
