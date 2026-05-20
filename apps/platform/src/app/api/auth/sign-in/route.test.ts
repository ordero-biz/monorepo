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

  it('forwards backend errors during sign-in', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Invalid credentials.',
        }),
        {
          status: 401,
          statusText: 'Unauthorized',
        }
      )
    );
    const response = await signIn(
      new NextRequest('http://localhost/api/auth/sign-in', {
        body: JSON.stringify({
          email: 'admin@gmail.com',
          password: 'wrongPassword',
        }),
        method: 'POST',
      })
    );

    expect(response.status).toBe(401);
    await expect(getJson(response)).resolves.toStrictEqual({
      status: 401,
      message: 'Invalid credentials.',
    });
  });

  it('returns 400 Bad Request when request body is malformed or invalid JSON', async () => {
    const response = await signIn(
      new NextRequest('http://localhost/api/auth/sign-in', {
        body: 'invalid-json',
        method: 'POST',
      })
    );

    expect(response.status).toBe(400);
    await expect(getJson(response)).resolves.toStrictEqual({
      status: 400,
      message: 'Invalid sign-in request.',
    });
  });
});
