import { renderHook, waitFor } from '@testing-library/react';
import { getSession } from '@/lib/client/api/auth';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useSessionQuery } from './useSessionQuery';

vi.mock('@/lib/client/api/auth', async () => {
  const actual = await vi.importActual<typeof import('@/lib/client/api/auth')>(
    '@/lib/client/api/auth'
  );

  return {
    ...actual,
    getSession: vi.fn(),
  };
});

const getSessionMock = vi.mocked(getSession);

describe('auth queries', () => {
  beforeEach(() => {
    getSessionMock.mockReset();
  });

  it('returns session data and caches the query while data is fresh', async () => {
    const session = {
      authenticated: true,
      user: {
        email: 'admin@gmail.com',
      },
    } as const;

    getSessionMock.mockResolvedValue({
      ok: true,
      data: session,
    });

    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result, rerender } = renderHook(() => useSessionQuery(), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(session);

    rerender();

    expect(result.current.data).toEqual(session);
    expect(getSessionMock).toHaveBeenCalledTimes(1);
  });

  it('exposes the session request error without retrying', async () => {
    const error = {
      status: 401,
      message: 'Unauthorized',
    };

    getSessionMock.mockResolvedValue({
      ok: false,
      error,
    });

    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { result } = renderHook(() => useSessionQuery(), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
    expect(getSessionMock).toHaveBeenCalledTimes(1);
  });
});
