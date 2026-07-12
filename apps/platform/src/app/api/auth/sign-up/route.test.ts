import { AUTH_TOKEN_COOKIE_NAME } from '@ordero/next-api/server';
import { NextRequest } from 'next/server';
import { fetchBackendResponse } from '@/lib/server/fetch';
import { POST as signUpHandler } from './route';

const { fetchBackendResponseMock } = vi.hoisted(() => ({
  fetchBackendResponseMock: vi.fn(),
}));

vi.mock('@/lib/server/fetch', async () => ({
  ...(await vi.importActual<typeof import('@/lib/server/fetch')>(
    '@/lib/server/fetch'
  )),
  fetchBackendResponse: fetchBackendResponseMock,
}));

const fetchBackendResponseMocked = vi.mocked(fetchBackendResponse);

const getJson = async <T>(response: Response) => (await response.json()) as T;

describe('POST /api/auth/sign-up', () => {
  beforeEach(() => {
    fetchBackendResponseMocked.mockReset();
  });

  it('stores the token in an HttpOnly cookie after sign-up', async () => {
    fetchBackendResponseMocked.mockResolvedValue({
      ok: true,
      data: new Response(
        JSON.stringify({
          token: 'new-jwt-token',
          ownerResponse: {
            id: 'owner-id',
            email: 'new-user@gmail.com',
          },
        })
      ),
    });
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
    expect(fetchBackendResponseMocked).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/api/v1/platform/owners/sign-up',
        init: expect.objectContaining({
          body: JSON.stringify({
            email: 'new-user@gmail.com',
            password: 'securePassword1',
          }),
          headers: expect.any(Headers),
          method: 'POST',
        }),
      })
    );
    const [backendRequest] = fetchBackendResponseMocked.mock.calls[0] ?? [];

    expect(new Headers(backendRequest?.init?.headers).get('content-type')).toBe(
      'application/json'
    );
  });

  it('forwards normalized backend errors during sign-up', async () => {
    fetchBackendResponseMocked.mockResolvedValue({
      ok: false,
      error: {
        status: 409,
        message: 'Email already exists.',
        fieldErrors: { email: 'This email is already registered.' },
      },
    });
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
    fetchBackendResponseMocked.mockResolvedValue({
      ok: true,
      data: makeResponse(),
    });
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
    expect(fetchBackendResponseMocked).not.toHaveBeenCalled();
  });
});
