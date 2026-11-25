import { SUPPLIER_STATUS } from '@/lib/domain/suppliers/constants';
import {
  createSupplier,
  getSupplier,
  getSuppliers,
  getSuppliersPath,
  updateSupplier,
} from '.';

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
      '/api/backend/api/v1/suppliers?page=1&size=10&sort=name%2Casc&sort=email%2Cdesc'
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
              status: SUPPLIER_STATUS.DRAFT,
              email: 'orders@fresh.example',
              phone: '+1 555 0100',
              address: '123 Market St',
              comment: 'Preferred produce supplier',
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

    await expect(getSuppliers()).resolves.toEqual({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Fresh Farms',
            status: SUPPLIER_STATUS.DRAFT,
            email: 'orders@fresh.example',
            phone: '+1 555 0100',
            address: '123 Market St',
            comment: 'Preferred produce supplier',
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
      '/api/backend/api/v1/suppliers?page=0&size=10',
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

  it('gets a supplier detail from the backend proxy on success', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 1,
          name: 'Fresh Farms',
          status: SUPPLIER_STATUS.DRAFT,
          email: 'orders@fresh.example',
          phone: '+1 555 0100',
          address: '123 Market St',
          comment: 'Preferred produce supplier',
        })
      )
    );

    await expect(getSupplier('1')).resolves.toEqual({
      ok: true,
      data: {
        id: 1,
        name: 'Fresh Farms',
        status: SUPPLIER_STATUS.DRAFT,
        email: 'orders@fresh.example',
        phone: '+1 555 0100',
        address: '123 Market St',
        comment: 'Preferred produce supplier',
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/suppliers/1',
      expect.objectContaining({
        method: 'GET',
        cache: 'no-store',
      })
    );
  });

  it('returns normalized failures from the supplier detail route', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Supplier not found.',
          code: 'SUPPLIER_NOT_FOUND',
        }),
        {
          status: 404,
          statusText: 'Not Found',
        }
      )
    );

    await expect(getSupplier('404')).resolves.toEqual({
      ok: false,
      error: {
        status: 404,
        message: 'Supplier not found.',
        code: 'SUPPLIER_NOT_FOUND',
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
          status: SUPPLIER_STATUS.DRAFT,
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
        status: SUPPLIER_STATUS.DRAFT,
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
        status: SUPPLIER_STATUS.DRAFT,
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
          status: SUPPLIER_STATUS.DRAFT,
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
        status: SUPPLIER_STATUS.DRAFT,
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

  it('patches a supplier through the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 1,
          name: 'Fresh Farms Updated',
          status: SUPPLIER_STATUS.DRAFT,
          email: 'orders.updated@fresh.example',
          phone: '+1 555 0101',
          address: '124 Market St',
          comment: 'Updated supplier',
        })
      )
    );

    await expect(
      updateSupplier({
        supplierId: 1,
        name: 'Fresh Farms Updated',
        status: SUPPLIER_STATUS.DRAFT,
        email: 'orders.updated@fresh.example',
        phone: '+1 555 0101',
        address: '124 Market St',
        comment: 'Updated supplier',
      })
    ).resolves.toEqual({
      ok: true,
      data: {
        id: 1,
        name: 'Fresh Farms Updated',
        status: SUPPLIER_STATUS.DRAFT,
        email: 'orders.updated@fresh.example',
        phone: '+1 555 0101',
        address: '124 Market St',
        comment: 'Updated supplier',
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/suppliers/1',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({
          name: 'Fresh Farms Updated',
          status: SUPPLIER_STATUS.DRAFT,
          email: 'orders.updated@fresh.example',
          phone: '+1 555 0101',
          address: '124 Market St',
          comment: 'Updated supplier',
        }),
        cache: 'no-store',
      })
    );
  });

  it('patches only the status when publishing a supplier', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 1,
          name: 'Fresh Farms',
          status: SUPPLIER_STATUS.ACTIVE,
        })
      )
    );

    await updateSupplier({
      supplierId: 1,
      status: SUPPLIER_STATUS.ACTIVE,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/suppliers/1',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ status: SUPPLIER_STATUS.ACTIVE }),
      })
    );
  });

  it('sends null when clearing a supplier contact field', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 1,
          name: 'Fresh Farms',
          status: SUPPLIER_STATUS.DRAFT,
          email: null,
        })
      )
    );

    await updateSupplier({
      supplierId: 1,
      email: null,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/suppliers/1',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ email: null }),
      })
    );
  });

  it('returns normalized failures from the update supplier route', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Supplier update failed.',
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
      updateSupplier({
        supplierId: 1,
        name: 'Fresh Farms',
        status: SUPPLIER_STATUS.DRAFT,
        email: 'orders@fresh.example',
        phone: '+1 555 0100',
        address: '123 Market St',
        comment: '',
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        status: 422,
        message: 'Supplier update failed.',
        code: undefined,
        fieldErrors: {
          email: 'Supplier email already exists.',
        },
      },
    });
  });
});
