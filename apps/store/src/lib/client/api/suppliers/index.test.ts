import { createSupplier, getSuppliers, getSuppliersPath } from '.';

describe('supplier client helpers', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('builds supplier pageable search params', () => {
    expect(
      getSuppliersPath({
        page: 2,
        size: 10,
        sort: ['name,asc', 'email,desc'],
      })
    ).toBe(
      '/api/backend/api/v1/suppliers?page=2&size=10&sort=name%2Casc&sort=email%2Cdesc'
    );
  });

  it('gets suppliers from the backend proxy on success', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          content: [
            {
              id: 1,
              name: 'Fresh Farms',
              email: 'orders@fresh.example',
              phone: '+1 555 0100',
              address: '123 Market St',
              comment: 'Preferred produce supplier',
            },
          ],
          page: {
            size: 25,
            number: 0,
            totalElements: 1,
            totalPages: 1,
          },
        })
      )
    );

    await expect(getSuppliers()).resolves.toEqual({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Fresh Farms',
            email: 'orders@fresh.example',
            phone: '+1 555 0100',
            address: '123 Market St',
            comment: 'Preferred produce supplier',
          },
        ],
        page: {
          size: 25,
          number: 0,
          totalElements: 1,
          totalPages: 1,
        },
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/suppliers?page=0&size=25',
      expect.objectContaining({
        method: 'GET',
        cache: 'no-store',
      })
    );
  });

  it('returns normalized failures from the suppliers route', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Suppliers lookup failed.',
          code: 'SUPPLIERS_LOOKUP_FAILED',
        }),
        {
          status: 503,
          statusText: 'Service Unavailable',
        }
      )
    );

    await expect(getSuppliers()).resolves.toEqual({
      ok: false,
      error: {
        status: 503,
        message: 'Suppliers lookup failed.',
        code: 'SUPPLIERS_LOOKUP_FAILED',
        fieldErrors: undefined,
      },
    });
  });

  it('posts a new supplier through the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 1,
          name: 'Fresh Farms',
          email: 'orders@fresh.example',
          phone: '+1 555 0100',
          address: '123 Market St',
          comment: 'Preferred produce supplier',
        })
      )
    );

    await expect(
      createSupplier({
        name: 'Fresh Farms',
        email: 'orders@fresh.example',
        phone: '+1 555 0100',
        address: '123 Market St',
        comment: 'Preferred produce supplier',
      })
    ).resolves.toEqual({
      ok: true,
      data: {
        id: 1,
        name: 'Fresh Farms',
        email: 'orders@fresh.example',
        phone: '+1 555 0100',
        address: '123 Market St',
        comment: 'Preferred produce supplier',
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/suppliers',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'Fresh Farms',
          email: 'orders@fresh.example',
          phone: '+1 555 0100',
          address: '123 Market St',
          comment: 'Preferred produce supplier',
        }),
        cache: 'no-store',
      })
    );
  });

  it('returns normalized failures from the create supplier route', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Supplier creation failed.',
          fieldErrors: {
            email: 'Supplier email already exists.',
          },
        }),
        {
          status: 422,
          statusText: 'Unprocessable Entity',
        }
      )
    );

    await expect(
      createSupplier({
        name: 'Fresh Farms',
        email: 'orders@fresh.example',
        phone: '+1 555 0100',
        address: '123 Market St',
        comment: '',
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        status: 422,
        message: 'Supplier creation failed.',
        code: undefined,
        fieldErrors: {
          email: 'Supplier email already exists.',
        },
      },
    });
  });
});
