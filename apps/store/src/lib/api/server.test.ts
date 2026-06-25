import { AUTH_TOKEN_COOKIE_NAME } from '@ordero/next-api/server';
import { fetchBackendResponse } from './server';

const backendApiUrl = 'https://backend.example.test/base/';

describe('fetchBackendResponse', () => {
  beforeEach(() => {
    process.env.BACKEND_API_URL = backendApiUrl;
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.BACKEND_API_URL;
  });

  it('uses the app forwarded header names for backend responses', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('{}'));

    await fetchBackendResponse({
      path: '/orders',
      init: {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer browser-token',
          cookie: `${AUTH_TOKEN_COOKIE_NAME}=jwt-token`,
          origin: 'https://tenant.example.test',
          'x-forwarded-host': 'tenant.example.test',
        },
      },
    });

    const [, request] = vi.mocked(fetch).mock.calls[0] ?? [];
    const headers = new Headers(request?.headers);

    expect(Object.fromEntries(headers.entries())).toEqual({
      accept: 'application/json',
      origin: 'https://tenant.example.test',
    });
  });
});
