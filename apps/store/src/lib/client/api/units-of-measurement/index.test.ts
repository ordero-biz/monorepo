import {
  createUnitOfMeasurement,
  getUnitsOfMeasurement,
  getUnitsOfMeasurementPath,
} from '.';

describe('units of measurement client helpers', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('builds units of measurement pageable search params', () => {
    expect(
      getUnitsOfMeasurementPath({
        page: 2,
        size: 10,
        sort: ['name,asc', 'code,desc'],
      })
    ).toBe(
      '/api/backend/api/v1/units-of-measurement?page=2&size=10&sort=name%2Casc&sort=code%2Cdesc'
    );
  });

  it('gets units of measurement from the backend proxy on success', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          content: [
            {
              id: 1,
              code: 'KG',
              name: 'Kilogram',
              symbol: 'kg',
              comment: 'Weight unit',
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

    await expect(getUnitsOfMeasurement()).resolves.toEqual({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            code: 'KG',
            name: 'Kilogram',
            symbol: 'kg',
            comment: 'Weight unit',
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
      '/api/backend/api/v1/units-of-measurement?page=0&size=10',
      expect.objectContaining({
        method: 'GET',
        cache: 'no-store',
      })
    );
  });

  it('returns normalized failures from the units of measurement route', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Units of measurement lookup failed.',
          code: 'UNITS_OF_MEASUREMENT_LOOKUP_FAILED',
        }),
        {
          status: 503,
          statusText: 'Service Unavailable',
        }
      )
    );

    await expect(getUnitsOfMeasurement()).resolves.toEqual({
      ok: false,
      error: {
        status: 503,
        message: 'Units of measurement lookup failed.',
        code: 'UNITS_OF_MEASUREMENT_LOOKUP_FAILED',
        fieldErrors: undefined,
      },
    });
  });

  it('posts a new unit of measurement through the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 1,
          code: 'KG',
          name: 'Kilogram',
          symbol: 'kg',
          comment: 'Weight unit',
        })
      )
    );

    await expect(
      createUnitOfMeasurement({
        code: 'KG',
        name: 'Kilogram',
        symbol: 'kg',
        comment: 'Weight unit',
      })
    ).resolves.toEqual({
      ok: true,
      data: {
        id: 1,
        code: 'KG',
        name: 'Kilogram',
        symbol: 'kg',
        comment: 'Weight unit',
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/units-of-measurement',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          code: 'KG',
          name: 'Kilogram',
          symbol: 'kg',
          comment: 'Weight unit',
        }),
        cache: 'no-store',
      })
    );
  });

  it('returns normalized failures from the create unit of measurement route', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Unit of measurement creation failed.',
          fieldErrors: {
            code: 'Unit code already exists.',
          },
        }),
        {
          status: 422,
          statusText: 'Unprocessable Entity',
        }
      )
    );

    await expect(
      createUnitOfMeasurement({
        code: 'KG',
        name: 'Kilogram',
        symbol: 'kg',
        comment: '',
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        status: 422,
        message: 'Unit of measurement creation failed.',
        code: undefined,
        fieldErrors: {
          code: 'Unit code already exists.',
        },
      },
    });
  });
});
