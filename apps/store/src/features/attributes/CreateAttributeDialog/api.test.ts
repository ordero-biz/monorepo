import { createAttribute } from './api';

describe('createAttribute', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('posts a new attribute through the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 1,
          name: 'Material',
          sortOrder: 10,
          createdAt: '2026-05-26T20:55:51.542Z',
        })
      )
    );

    await expect(
      createAttribute({
        name: 'Material',
        sortOrder: 0,
        values: ['Green', 'Blue'],
      })
    ).resolves.toEqual({
      ok: true,
      data: {
        id: 1,
        name: 'Material',
        sortOrder: 10,
        createdAt: '2026-05-26T20:55:51.542Z',
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/attributes',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'Material',
          sortOrder: 0,
          values: ['Green', 'Blue'],
        }),
        cache: 'no-store',
      })
    );
  });

  it('returns normalized failures from the create attribute route', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Attribute creation failed.',
          fieldErrors: {
            name: 'Attribute name already exists.',
          },
        }),
        {
          status: 422,
          statusText: 'Unprocessable Entity',
        }
      )
    );

    await expect(
      createAttribute({
        name: 'Material',
        sortOrder: 0,
        values: ['Green'],
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        status: 422,
        message: 'Attribute creation failed.',
        code: undefined,
        fieldErrors: {
          name: 'Attribute name already exists.',
        },
      },
    });
  });
});
