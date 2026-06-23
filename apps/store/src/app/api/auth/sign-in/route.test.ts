import { AUTH_TOKEN_COOKIE_NAME } from '@ordero/next-api/server';
import { NextRequest } from 'next/server';
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
      new URL('/api/v1/employees/sign-in', backendApiUrl),
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

  it.each([
    ['empty body', () => new Response(null)],
    ['JSON null body', () => new Response('null')],
    ['missing token body', () => new Response(JSON.stringify({}))],
  ])('returns 502 when the backend returns a success response with %s', async (_caseName, makeResponse) => {
    fetchMock.mockResolvedValue(makeResponse());
    const response = await signIn(
      new NextRequest('http://localhost/api/auth/sign-in', {
        body: JSON.stringify({
          email: 'admin@gmail.com',
          password: '123456',
        }),
        method: 'POST',
      })
    );

    expect(response.status).toBe(502);
    expect(response.headers.get('set-cookie')).toBeNull();
    await expect(getJson(response)).resolves.toStrictEqual({
      status: 502,
      message: 'Backend did not return a token.',
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
