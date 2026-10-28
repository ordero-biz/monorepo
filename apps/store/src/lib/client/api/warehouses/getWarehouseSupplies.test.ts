import { apiFetch } from '@ordero/api-client';
import { getWarehouseSupplies, getWarehouseSuppliesPath } from '.';

vi.mock('@ordero/api-client', () => ({ apiFetch: vi.fn() }));

describe('warehouse supplies client helper', () => {
  it('builds the warehouse-scoped path and converts pagination to zero-based pages', () => {
    expect(getWarehouseSuppliesPath(7)).toBe(
      '/api/backend/api/v1/warehouses/7/supplies?page=0&size=10'
    );
    expect(
      getWarehouseSuppliesPath('7', {
        page: 3,
        size: 25,
        sort: ['createdAt,desc'],
      })
    ).toBe(
      '/api/backend/api/v1/warehouses/7/supplies?page=2&size=25&sort=createdAt%2Cdesc'
    );
  });

  it('returns the paginated response from the authenticated proxy', async () => {
    const result = {
      ok: true as const,
      data: {
        content: [
          {
            id: 4,
            supplier: { id: 2, name: 'Roastworks', status: 'ACTIVE' },
            status: 'DRAFT',
            totalPrice: 25,
          },
        ],
        page: { number: 1, size: 10, totalElements: 11, totalPages: 2 },
      },
    };
    vi.mocked(apiFetch).mockResolvedValueOnce(result);
    await expect(
      getWarehouseSupplies(7, { page: 2, size: 10 })
    ).resolves.toEqual(result);
    expect(apiFetch).toHaveBeenCalledWith(
      '/api/backend/api/v1/warehouses/7/supplies?page=1&size=10',
      { method: 'GET' }
    );
  });

  it('preserves normalized API errors', async () => {
    const result = {
      ok: false as const,
      error: { status: 503, message: 'Supplies unavailable.' },
    };
    vi.mocked(apiFetch).mockResolvedValueOnce(result);
    await expect(getWarehouseSupplies(7)).resolves.toEqual(result);
  });
});
