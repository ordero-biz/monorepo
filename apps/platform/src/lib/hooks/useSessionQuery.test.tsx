import { render, screen, waitFor } from '@testing-library/react';
import { getSession } from '@/lib/api/client';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useSessionQuery } from './useSessionQuery';

vi.mock('@/lib/api/client', async () => {
  const actual = await vi.importActual<typeof import('@/lib/api/client')>(
    '@/lib/api/client'
  );

  return {
    ...actual,
    getSession: vi.fn(),
  };
});

const getSessionMock = vi.mocked(getSession);

const SessionStatus = () => {
  const session = useSessionQuery();

  if (session.isPending) {
    return <span>Loading</span>;
  }

  return (
    <span>{session.data?.authenticated ? 'Signed in' : 'Signed out'}</span>
  );
};

describe('auth queries', () => {
  beforeEach(() => {
    getSessionMock.mockReset();
  });

  it('caches the session query while data is fresh', async () => {
    getSessionMock.mockResolvedValue({
      ok: true,
      data: {
        authenticated: true,
        user: {
          email: 'admin@gmail.com',
        },
      },
    });

    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { rerender } = render(<SessionStatus />, {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(screen.getByText('Signed in')).toBeVisible());

    rerender(<SessionStatus />);

    await waitFor(() => expect(screen.getByText('Signed in')).toBeVisible());
    expect(getSessionMock).toHaveBeenCalledTimes(1);
  });
});
