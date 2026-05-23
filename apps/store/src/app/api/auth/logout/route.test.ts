import { NextRequest } from 'next/server';
import { AUTH_TOKEN_COOKIE_NAME } from '@/lib/api/constants';
import { POST as logout } from './route';

const fetchMock = vi.fn();
const backendApiUrl = 'https://backend.example.test';

const getJson = async <T>(response: Response) => (await response.json()) as T;

describe('POST /api/auth/logout', () => {
  beforeEach(() => {
    process.env.BACKEND_API_URL = backendApiUrl;
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.BACKEND_API_URL;
  });

  it('clears the auth cookie after logout', async () => {
    fetchMock.mockResolvedValue(new Response(null));
    const response = await logout(
      new NextRequest('http://localhost/api/auth/logout', {
        headers: {
          cookie: `${AUTH_TOKEN_COOKIE_NAME}=jwt-token`,
        },
        method: 'POST',
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
