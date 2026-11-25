import { createStore, getStores } from '.';

describe('client stores helpers', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('getStores reads the current owner stores through the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            id: 1,
            name: 'North Shop',
            subDomain: 'north-shop',
          },
        ])
      )
    );

    await expect(getStores()).resolves.toEqual({
      ok: true,
      data: [
        {
          id: 1,
          name: 'North Shop',
          subDomain: 'north-shop',
        },
      ],
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/platform/enterprise',
      expect.objectContaining({
        method: 'GET',
        cache: 'no-store',
      })
    );
  });

  it('getStores returns normalized backend failures', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Unable to load stores.',
          code: 'STORES_UNAVAILABLE',
        }),
        {
          status: 503,
          statusText: 'Service Unavailable',
        }
      )
    );

    await expect(getStores()).resolves.toStrictEqual({
      ok: false,
      error: {
        status: 503,
        message: 'Unable to load stores.',
        code: 'STORES_UNAVAILABLE',
        fieldErrors: undefined,
      },
    });
  });

  it('createStore posts the swagger create-enterprise payload through the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 1,
          name: 'North Shop',
          subDomain: 'north-shop',
        })
      )
    );

    await expect(
      createStore({
        name: 'North Shop',
        subDomain: 'north-shop',
      })
    ).resolves.toEqual({
      ok: true,
      data: {
        id: 1,
        name: 'North Shop',
        subDomain: 'north-shop',
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/platform/enterprise',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'North Shop',
          subDomain: 'north-shop',
        }),
        cache: 'no-store',
      })
    );
  });

  it('createStore returns normalized backend validation failures', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Validation failed.',
          fieldErrors: {
            subDomain: 'Subdomain is already taken.',
          },
        }),
        {
          status: 422,
          statusText: 'Unprocessable Entity',
        }
      )
    );

    await expect(
      createStore({
        name: 'North Shop',
        subDomain: 'north-shop',
      })
    ).resolves.toStrictEqual({
      ok: false,
      error: {
        status: 422,
        message: 'Validation failed.',
        code: undefined,
        fieldErrors: {
          subDomain: 'Subdomain is already taken.',
        },
      },
    });
  });
});
