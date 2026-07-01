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
});
