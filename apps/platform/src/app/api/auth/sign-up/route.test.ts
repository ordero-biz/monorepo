import { NextRequest } from 'next/server';
import { AUTH_TOKEN_COOKIE_NAME } from '@/lib/api/constants';
import { POST as signUpHandler } from './route';

const fetchMock = vi.fn();
const backendApiUrl = 'https://backend.example.test';

const getJson = async <T>(response: Response) => (await response.json()) as T;

describe('POST /api/auth/sign-up', () => {
  beforeEach(() => {
    process.env.BACKEND_API_URL = backendApiUrl;
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.BACKEND_API_URL;
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

  it('returns 400 Bad Request when request body is malformed or invalid JSON', async () => {
    const response = await signUpHandler(
      new NextRequest('http://localhost/api/auth/sign-up', {
        body: 'invalid-json',
        method: 'POST',
      })
    );

    expect(response.status).toBe(400);
    await expect(getJson(response)).resolves.toStrictEqual({
      status: 400,
      message: 'Invalid sign-up request.',
    });
  });
});
