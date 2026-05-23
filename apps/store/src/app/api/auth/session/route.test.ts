import { NextRequest } from 'next/server';
import { AUTH_TOKEN_COOKIE_NAME } from '@/lib/api/constants';
import { GET as getSession } from './route';

const fetchMock = vi.fn();
const backendApiUrl = 'https://backend.example.test';

const getJson = async <T>(response: Response) => (await response.json()) as T;

describe('GET /api/auth/session', () => {
  beforeEach(() => {
    process.env.BACKEND_API_URL = backendApiUrl;
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.BACKEND_API_URL;
  });

  it('returns a session from the backend /me endpoint when a token exists', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          email: 'admin@gmail.com',
        })
      )
    );
    const response = await getSession(
      new NextRequest('http://localhost/api/auth/session', {
        headers: {
          cookie: `${AUTH_TOKEN_COOKIE_NAME}=jwt-token`,
        },
      })
    );

    await expect(getJson(response)).resolves.toStrictEqual({
      authenticated: true,
      user: {
        email: 'admin@gmail.com',
      },
    });
    const [, fetchOptions] = fetchMock.mock.calls[0] ?? [];
    const headers = new Headers(fetchOptions?.headers);
    expect(headers.get('Authorization')).toBe('Bearer jwt-token');
  });

  it('clears the auth cookie and returns signed out when /me rejects the token', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Token expired.',
        }),
        {
          status: 401,
          statusText: 'Unauthorized',
        }
      )
    );
    const response = await getSession(
      new NextRequest('http://localhost/api/auth/session', {
        headers: {
          cookie: `${AUTH_TOKEN_COOKIE_NAME}=stale-token`,
        },
      })
    );

    await expect(getJson(response)).resolves.toStrictEqual({
      authenticated: false,
    });
    expect(response.headers.get('set-cookie')).toContain(
      `${AUTH_TOKEN_COOKIE_NAME}=`
    );
    expect(response.headers.get('set-cookie')).toContain('Max-Age=0');
  });
});
