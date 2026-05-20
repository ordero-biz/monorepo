import { NextRequest } from 'next/server';
import { AUTH_TOKEN_COOKIE_NAME } from '@/lib/api/constants';
import { POST as signIn } from './route';

const fetchMock = vi.fn();
const backendApiUrl = 'https://backend.example.test';

const getJson = async <T>(response: Response) => (await response.json()) as T;

describe('POST /api/auth/sign-in', () => {
  beforeEach(() => {
    process.env.BACKEND_API_URL = backendApiUrl;
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.BACKEND_API_URL;
  });

  it('stores the token in an HttpOnly cookie after sign-in', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          token: 'jwt-token',
          user: {
            email: 'admin@gmail.com',
          },
        })
      )
    );
    const response = await signIn(
      new NextRequest('http://localhost/api/auth/sign-in', {
        body: JSON.stringify({
          email: 'admin@gmail.com',
          password: '123456',
        }),
        method: 'POST',
      })
    );

    await expect(getJson(response)).resolves.toStrictEqual({
      authenticated: true,
      user: {
        email: 'admin@gmail.com',
      },
    });
    expect(response.headers.get('set-cookie')).toContain(
      `${AUTH_TOKEN_COOKIE_NAME}=jwt-token`
    );
    expect(response.headers.get('set-cookie')).toContain('HttpOnly');
    expect(fetchMock).toHaveBeenCalledWith(
      new URL('/api/v1/platform/owners/login', backendApiUrl),
      expect.objectContaining({
        method: 'POST',
      })
    );
  });
});
