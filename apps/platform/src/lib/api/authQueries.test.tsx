import { render, screen, waitFor } from '@testing-library/react';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useSessionQuery } from './authQueries';
import { login } from './client';

const fetchMock = vi.fn();

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
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('caches the session query while data is fresh', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          authenticated: true,
          user: {
            email: 'admin@gmail.com',
          },
        })
      )
    );

    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { rerender } = render(<SessionStatus />, {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(screen.getByText('Signed in')).toBeVisible());

    rerender(<SessionStatus />);

    await waitFor(() => expect(screen.getByText('Signed in')).toBeVisible());
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('keeps auth actions uncached', async () => {
    fetchMock.mockImplementation(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            authenticated: true,
          })
        )
      )
    );

    await login({
      email: 'admin@gmail.com',
      password: '123456',
    });
    await login({
      email: 'admin@gmail.com',
      password: '123456',
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
