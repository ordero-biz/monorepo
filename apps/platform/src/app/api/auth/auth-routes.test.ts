import { NextRequest } from 'next/server';
import { AUTH_TOKEN_COOKIE_NAME } from '@/lib/api/constants';
import { POST as login } from './login/route';
import { POST as logout } from './logout/route';
import { GET as getSession } from './session/route';
import { POST as signUpHandler } from './sign-up/route';

const fetchMock = vi.fn();
const backendApiUrl = 'https://backend.example.test';

const getJson = async <T>(response: Response) => (await response.json()) as T;

describe('auth route handlers', () => {
  beforeEach(() => {
    process.env.BACKEND_API_URL = backendApiUrl;
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.BACKEND_API_URL;
  });

  it('stores the access token in an HttpOnly cookie after login', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          accessToken: 'jwt-token',
          user: {
            email: 'admin@gmail.com',
          },
        })
      )
    );
    const response = await login(
      new NextRequest('http://localhost/api/auth/login', {
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
      new URL('/auth/login', backendApiUrl),
      expect.objectContaining({
        method: 'POST',
      })
    );
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
    expect(fetchMock.mock.calls[0][1].headers.get('Authorization')).toBe(
      'Bearer jwt-token'
    );
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

  it('stores the token in an HttpOnly cookie after sign-up', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          token: 'new-jwt-token',
        })
      )
    );
    const response = await signUpHandler(
      new NextRequest('http://localhost/api/auth/sign-up', {
        body: JSON.stringify({
          email: 'new-user@gmail.com',
          password: 'securePassword1',
        }),
        method: 'POST',
      })
    );

    await expect(getJson(response)).resolves.toStrictEqual({
      authenticated: true,
    });
    expect(response.headers.get('set-cookie')).toContain(
      `${AUTH_TOKEN_COOKIE_NAME}=new-jwt-token`
    );
    expect(response.headers.get('set-cookie')).toContain('HttpOnly');
    expect(fetchMock).toHaveBeenCalledWith(
      new URL('/api/v1/platform/owners/sign-up', backendApiUrl),
      expect.objectContaining({
        method: 'POST',
      })
    );
  });

  it('forwards backend errors during sign-up', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Email already exists.',
          fieldErrors: { email: 'This email is already registered.' },
        }),
        {
          status: 409,
          statusText: 'Conflict',
        }
      )
    );
    const response = await signUpHandler(
      new NextRequest('http://localhost/api/auth/sign-up', {
        body: JSON.stringify({
          email: 'existing@gmail.com',
          password: 'securePassword1',
        }),
        method: 'POST',
      })
    );

    expect(response.status).toBe(409);
    await expect(getJson(response)).resolves.toStrictEqual({
      status: 409,
      message: 'Email already exists.',
      fieldErrors: { email: 'This email is already registered.' },
    });
  });
});
