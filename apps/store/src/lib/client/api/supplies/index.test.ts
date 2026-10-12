import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import { getSupplies, getSuppliesPath } from '.';

describe('supply client helpers', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('builds supply pageable search params', () => {
    expect(
      getSuppliesPath({
        page: 2,
        size: 10,
        sort: ['createdAt,desc'],
      })
    ).toBe('/api/backend/api/v1/supplies?page=1&size=10&sort=createdAt%2Cdesc');
  });

  it('gets supplies from the backend proxy', async () => {
    const response = {
      content: [
        {
          id: 1,
          supplier: { id: 2, name: 'Fresh Farms', status: 'ACTIVE' },
          warehouse: { id: 3, name: 'Main warehouse', status: 'ACTIVE' },
          status: SUPPLY_STATUS.DRAFT,
          supplyNumber: 'SUP-001',
          supplierInvoiceNumber: 'INV-001',
          totalQuantity: 12,
          totalPrice: 48.5,
        },
      ],
      page: { size: 10, number: 0, totalElements: 1, totalPages: 1 },
    };
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue(new Response(JSON.stringify(response)));

    await expect(getSupplies()).resolves.toEqual({
      ok: true,
      data: response,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/supplies?page=0&size=10',
      expect.objectContaining({
        cache: 'no-store',
        method: 'GET',
      })
    );
  });

  it('returns normalized failures from the supplies route', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          code: 'SUPPLIES_LOOKUP_FAILED',
          message: 'Supplies lookup failed.',
        }),
        { status: 503, statusText: 'Service Unavailable' }
      )
    );

    await expect(getSupplies()).resolves.toEqual({
      ok: false,
      error: {
        code: 'SUPPLIES_LOOKUP_FAILED',
        fieldErrors: undefined,
        message: 'Supplies lookup failed.',
        status: 503,
      },
    });
  });
});
