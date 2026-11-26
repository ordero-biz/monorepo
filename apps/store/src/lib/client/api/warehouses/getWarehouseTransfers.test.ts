import { apiFetch } from '@ordero/api-client';
import { getWarehouseTransfers, getWarehouseTransfersPath } from '.';

vi.mock('@ordero/api-client', () => ({ apiFetch: vi.fn() }));

describe('warehouse transfers client helper', () => {
  it('builds the warehouse-scoped path and converts pagination to zero-based pages', () => {
    expect(getWarehouseTransfersPath(7)).toBe(
      '/api/backend/api/v1/warehouses/7/transfers?page=0&size=10'
    );
    expect(
      getWarehouseTransfersPath('7', {
        page: 3,
        size: 25,
        sort: ['createdAt,desc'],
      })
    ).toBe(
      '/api/backend/api/v1/warehouses/7/transfers?page=2&size=25&sort=createdAt%2Cdesc'
    );
  });

  it('returns the paginated response from the authenticated proxy', async () => {
    const result = {
      ok: true as const,
      data: {
        content: [
          {
            id: 4,
            transferNumber: 'TR-0004',
            status: 'DRAFT',
          },
        ],
        page: { number: 1, size: 10, totalElements: 11, totalPages: 2 },
      },
    };
    vi.mocked(apiFetch).mockResolvedValueOnce(result);
    await expect(
      getWarehouseTransfers(7, { page: 2, size: 10 })
    ).resolves.toEqual(result);
    expect(apiFetch).toHaveBeenCalledWith(
      '/api/backend/api/v1/warehouses/7/transfers?page=1&size=10',
      { method: 'GET' }
    );
  });

  it('preserves normalized API errors', async () => {
    const result = {
      ok: false as const,
      error: { status: 503, message: 'Transfers unavailable.' },
    };
    vi.mocked(apiFetch).mockResolvedValueOnce(result);
    await expect(getWarehouseTransfers(7)).resolves.toEqual(result);
  });
});
