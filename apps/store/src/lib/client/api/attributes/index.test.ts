import {
  ATTRIBUTE_STATUS,
  ATTRIBUTE_VALUE_STATUS,
} from '@/lib/domain/attributes/constants';
import {
  createAttribute,
  createAttributeValues,
  deleteAttributes,
  deleteAttributeValues,
  getAttribute,
  getAttributes,
  getAttributesPath,
  getAttributeValues,
  updateAttribute,
  updateAttributeValue,
} from '.';

describe('attribute client helpers', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('builds attribute pageable search params', () => {
    expect(
      getAttributesPath({
        page: 2,
        size: 10,
        sort: ['name,asc', 'createdAt,desc'],
      })
    ).toBe(
      '/api/backend/api/v1/attributes?page=1&size=10&sort=name%2Casc&sort=createdAt%2Cdesc'
    );
  });

  it('gets attributes from the backend proxy on success', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          content: [
            {
              id: 1,
              name: 'Size',
              sortOrder: 10,
              createdAt: '2026-05-26T20:55:51.542Z',
            },
          ],
          page: {
            size: 10,
            number: 0,
            totalElements: 1,
            totalPages: 1,
          },
        })
      )
    );

    await expect(getAttributes()).resolves.toEqual({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Size',
            sortOrder: 10,
            createdAt: '2026-05-26T20:55:51.542Z',
          },
        ],
        page: {
          size: 10,
          number: 0,
          totalElements: 1,
          totalPages: 1,
        },
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/attributes?page=0&size=10',
      expect.objectContaining({
        method: 'GET',
        cache: 'no-store',
      })
    );
  });

  it('gets attributes with pagination search params', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          content: [],
          page: {
            size: 10,
            number: 2,
            totalElements: 0,
            totalPages: 0,
          },
        })
      )
    );

    await getAttributes({
      page: 2,
      size: 10,
      sort: ['name,asc'],
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/attributes?page=1&size=10&sort=name%2Casc',
      expect.objectContaining({
        method: 'GET',
        cache: 'no-store',
      })
    );
  });

  it('returns normalized failures from the attributes route', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Attributes lookup failed.',
          code: 'ATTRIBUTES_LOOKUP_FAILED',
        }),
        {
          status: 503,
          statusText: 'Service Unavailable',
        }
      )
    );

    await expect(getAttributes()).resolves.toEqual({
      ok: false,
      error: {
        status: 503,
        message: 'Attributes lookup failed.',
        code: 'ATTRIBUTES_LOOKUP_FAILED',
        fieldErrors: undefined,
      },
    });
  });

  it('gets an attribute by id from the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 7,
          name: 'Color',
          sortOrder: 20,
          createdAt: '2026-06-24T20:07:32.467Z',
        })
      )
    );

    await expect(getAttribute(7)).resolves.toEqual({
      ok: true,
      data: {
        id: 7,
        name: 'Color',
        sortOrder: 20,
        createdAt: '2026-06-24T20:07:32.467Z',
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/attributes/7',
      expect.objectContaining({
        method: 'GET',
        cache: 'no-store',
      })
    );
  });

  it('gets attribute values by attribute id from the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            id: 3,
            name: 'Blue',
            sortOrder: 0,
            createdAt: '2026-06-24T20:07:32.467Z',
          },
        ])
      )
    );

    await expect(getAttributeValues(7)).resolves.toEqual({
      ok: true,
      data: [
        {
          id: 3,
          name: 'Blue',
          sortOrder: 0,
          createdAt: '2026-06-24T20:07:32.467Z',
        },
      ],
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/attributes/7/values',
      expect.objectContaining({
        method: 'GET',
        cache: 'no-store',
      })
    );
  });

  it('returns normalized failures from the attribute detail route', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Attribute lookup failed.',
          code: 'ATTRIBUTE_LOOKUP_FAILED',
        }),
        {
          status: 404,
          statusText: 'Not Found',
        }
      )
    );

    await expect(getAttribute(7)).resolves.toEqual({
      ok: false,
      error: {
        status: 404,
        message: 'Attribute lookup failed.',
        code: 'ATTRIBUTE_LOOKUP_FAILED',
        fieldErrors: undefined,
      },
    });
  });

  it('returns normalized failures from the attribute values route', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Attribute values lookup failed.',
        }),
        {
          status: 503,
          statusText: 'Service Unavailable',
        }
      )
    );

    await expect(getAttributeValues(7)).resolves.toEqual({
      ok: false,
      error: {
        status: 503,
        message: 'Attribute values lookup failed.',
        code: undefined,
        fieldErrors: undefined,
      },
    });
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
        status: ATTRIBUTE_STATUS.ACTIVE,
        attributeValues: [
          {
            name: 'Green',
            sortOrder: 0,
            status: ATTRIBUTE_VALUE_STATUS.ACTIVE,
          },
          {
            name: 'Blue',
            sortOrder: 1,
            status: ATTRIBUTE_VALUE_STATUS.DRAFT,
          },
        ],
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
          status: ATTRIBUTE_STATUS.ACTIVE,
          attributeValues: [
            {
              name: 'Green',
              sortOrder: 0,
              status: ATTRIBUTE_VALUE_STATUS.ACTIVE,
            },
            {
              name: 'Blue',
              sortOrder: 1,
              status: ATTRIBUTE_VALUE_STATUS.DRAFT,
            },
          ],
        }),
        cache: 'no-store',
      })
    );
  });

  it('posts attribute values in bulk through the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            id: 3,
            name: 'Green',
            sortOrder: 0,
            createdAt: '2026-07-18T07:53:03.586Z',
          },
        ])
      )
    );

    await expect(
      createAttributeValues({
        attributeId: 7,
        attributeValues: [
          {
            name: 'Green',
            sortOrder: 0,
            status: 'DRAFT',
          },
        ],
      })
    ).resolves.toEqual({
      ok: true,
      data: [
        {
          id: 3,
          name: 'Green',
          sortOrder: 0,
          createdAt: '2026-07-18T07:53:03.586Z',
        },
      ],
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/attributes/7/values/bulk',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          attributeValues: [
            {
              name: 'Green',
              sortOrder: 0,
              status: 'DRAFT',
            },
          ],
        }),
        cache: 'no-store',
      })
    );
  });

  it('returns normalized failures from the bulk attribute values route', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Attribute values could not be added.',
          code: 'ATTRIBUTE_VALUES_CREATE_FAILED',
          fieldErrors: {
            'attributeValues[0].name': 'Attribute value already exists.',
          },
        }),
        {
          status: 422,
          statusText: 'Unprocessable Entity',
        }
      )
    );

    await expect(
      createAttributeValues({
        attributeId: 7,
        attributeValues: [
          {
            name: 'Green',
            sortOrder: 0,
            status: 'DRAFT',
          },
        ],
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        status: 422,
        message: 'Attribute values could not be added.',
        code: 'ATTRIBUTE_VALUES_CREATE_FAILED',
        fieldErrors: {
          'attributeValues[0].name': 'Attribute value already exists.',
        },
      },
    });
  });

  it('patches an attribute through the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 7,
          name: 'Material',
          sortOrder: 10,
          createdAt: '2026-06-25T18:13:29.608Z',
        })
      )
    );

    await expect(
      updateAttribute({
        attributeId: 7,
        name: 'Material',
      })
    ).resolves.toEqual({
      ok: true,
      data: {
        id: 7,
        name: 'Material',
        sortOrder: 10,
        createdAt: '2026-06-25T18:13:29.608Z',
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/attributes/7',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({
          name: 'Material',
        }),
        cache: 'no-store',
      })
    );
  });

  it('patches an attribute status through the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 7,
          name: 'Material',
          sortOrder: 10,
          status: ATTRIBUTE_STATUS.ACTIVE,
          createdAt: '2026-06-25T18:13:29.608Z',
        })
      )
    );

    await expect(
      updateAttribute({
        attributeId: 7,
        status: ATTRIBUTE_STATUS.ACTIVE,
      })
    ).resolves.toEqual({
      ok: true,
      data: {
        id: 7,
        name: 'Material',
        sortOrder: 10,
        status: ATTRIBUTE_STATUS.ACTIVE,
        createdAt: '2026-06-25T18:13:29.608Z',
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/attributes/7',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({
          status: ATTRIBUTE_STATUS.ACTIVE,
        }),
        cache: 'no-store',
      })
    );
  });

  it('patches an attribute value through the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 3,
          name: 'Navy',
          sortOrder: 0,
          createdAt: '2026-06-25T18:13:29.608Z',
        })
      )
    );

    await expect(
      updateAttributeValue({
        attributeValueId: 3,
        name: 'Navy',
        sortOrder: 0,
      })
    ).resolves.toEqual({
      ok: true,
      data: {
        id: 3,
        name: 'Navy',
        sortOrder: 0,
        createdAt: '2026-06-25T18:13:29.608Z',
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/attributes/values/3',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({
          name: 'Navy',
          sortOrder: 0,
        }),
        cache: 'no-store',
      })
    );
  });

  it('patches an attribute value status through the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 3,
          name: 'Navy',
          sortOrder: 0,
          status: ATTRIBUTE_VALUE_STATUS.ACTIVE,
          createdAt: '2026-06-25T18:13:29.608Z',
        })
      )
    );

    await expect(
      updateAttributeValue({
        attributeValueId: 3,
        status: ATTRIBUTE_VALUE_STATUS.ACTIVE,
      })
    ).resolves.toEqual({
      ok: true,
      data: {
        id: 3,
        name: 'Navy',
        sortOrder: 0,
        status: ATTRIBUTE_VALUE_STATUS.ACTIVE,
        createdAt: '2026-06-25T18:13:29.608Z',
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/attributes/values/3',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({
          status: ATTRIBUTE_VALUE_STATUS.ACTIVE,
        }),
        cache: 'no-store',
      })
    );
  });

  it('returns normalized errors when publishing an attribute value fails', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          code: 'ATTRIBUTE_VALUE_MODIFICATION_NOT_ALLOWED',
          message: 'Conflict',
        }),
        {
          status: 409,
          statusText: 'Conflict',
        }
      )
    );

    await expect(
      updateAttributeValue({
        attributeValueId: 3,
        status: ATTRIBUTE_VALUE_STATUS.ACTIVE,
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        status: 409,
        code: 'ATTRIBUTE_VALUE_MODIFICATION_NOT_ALLOWED',
        message: 'Conflict',
        fieldErrors: undefined,
      },
    });
  });

  it('deletes attributes through the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await expect(
      deleteAttributes({
        attributeIds: [7],
      })
    ).resolves.toEqual({
      ok: true,
      data: undefined,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/attributes',
      expect.objectContaining({
        method: 'DELETE',
        body: JSON.stringify({
          attributeIds: [7],
        }),
        cache: 'no-store',
      })
    );
  });

  it('deletes attribute values through the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await expect(
      deleteAttributeValues({
        attributeValueIds: [3],
      })
    ).resolves.toEqual({
      ok: true,
      data: undefined,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/attributes/values',
      expect.objectContaining({
        method: 'DELETE',
        body: JSON.stringify({
          attributeValueIds: [3],
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
        status: 'DRAFT',
        attributeValues: [
          {
            name: 'Green',
            sortOrder: 0,
            status: 'DRAFT',
          },
        ],
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
