import { AUTH_TOKEN_COOKIE_NAME } from '@ordero/next-api/server';
import { NextRequest } from 'next/server';
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
          ownerResponse: {
            id: 'owner-id',
            email: 'new-user@gmail.com',
          },
        })
      )
    );
    const response = await signUpHandler(
      new NextRequest('http://localhost/api/auth/sign-up', {
        body: JSON.stringify({
          email: 'new-user@gmail.com',
          password: 'securePassword1',
        }),
        headers: {
          'content-type': 'text/plain',
          cookie: `${AUTH_TOKEN_COOKIE_NAME}=browser-cookie`,
        },
        method: 'POST',
      })
    );

    await expect(getJson(response)).resolves.toStrictEqual({
      authenticated: true,
      user: {
        id: 'owner-id',
        email: 'new-user@gmail.com',
      },
    });
    expect(response.headers.get('set-cookie')).toContain(
      `${AUTH_TOKEN_COOKIE_NAME}=new-jwt-token`
    );
    expect(response.headers.get('set-cookie')).toContain('HttpOnly');
    expect(fetchMock).toHaveBeenCalledWith(
      new URL('/api/v1/platform/owners/sign-up', backendApiUrl),
      expect.objectContaining({
        headers: expect.any(Headers),
        method: 'POST',
      })
    );
    const [, backendRequest] = fetchMock.mock.calls[0] ?? [];
    const headers = new Headers(backendRequest?.headers);

    expect(headers.get('content-type')).toBe('application/json');
    expect(headers.get('cookie')).toBeNull();
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
        headers: {
          'content-type': 'application/json',
        },
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

  it.each([
    ['empty body', () => new Response(null)],
    ['JSON null body', () => new Response('null')],
    ['missing token body', () => new Response(JSON.stringify({}))],
  ])('returns 502 when the backend returns a success response with %s', async (_caseName, makeResponse) => {
    fetchMock.mockResolvedValue(makeResponse());
    const response = await signUpHandler(
      new NextRequest('http://localhost/api/auth/sign-up', {
        body: JSON.stringify({
          email: 'new-user@gmail.com',
          password: 'securePassword1',
        }),
        headers: {
          'content-type': 'application/json',
        },
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
