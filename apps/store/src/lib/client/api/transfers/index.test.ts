import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import {
  createTransfer,
  deleteTransfer,
  getTransfer,
  getTransfers,
  getTransfersPath,
  updateTransfer,
} from '.';

describe('transfer client helpers', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('builds transfer pagination with a zero-based backend page', () => {
    expect(getTransfersPath()).toBe(
      '/api/backend/api/v1/warehouse-transfers?page=0&size=10'
    );
    expect(
      getTransfersPath({ page: 2, size: 10, sort: ['createdAt,desc'] })
    ).toBe(
      '/api/backend/api/v1/warehouse-transfers?page=1&size=10&sort=createdAt%2Cdesc'
    );
  });

  it('gets transfers from the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);
    const response = {
      content: [],
      page: { size: 10, number: 0, totalElements: 0, totalPages: 0 },
    };
    fetchMock.mockResolvedValue(new Response(JSON.stringify(response)));

    await expect(getTransfers()).resolves.toEqual({
      ok: true,
      data: response,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/warehouse-transfers?page=0&size=10',
      expect.objectContaining({ cache: 'no-store', method: 'GET' })
    );
  });

  it('posts a warehouse transfer through the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);
    const input = {
      sourceWarehouseId: 1,
      destinationWarehouseId: 2,
      transferNumber: 'Weekend restock',
      status: TRANSFER_STATUS.DRAFT,
      transferEntries: [
        { productVariantId: 11, unitOfMeasurementId: 4, quantity: 3 },
      ],
    };
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ id: 5 })));

    await expect(createTransfer(input)).resolves.toEqual({
      ok: true,
      data: { id: 5 },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/warehouse-transfers',
      expect.objectContaining({ method: 'POST' })
    );
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toEqual(
      input
    );
  });

  it('gets a transfer detail from the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);
    const transfer = { id: 5, status: TRANSFER_STATUS.DRAFT, version: 1 };
    fetchMock.mockResolvedValue(new Response(JSON.stringify(transfer)));

    await expect(getTransfer(5)).resolves.toEqual({
      ok: true,
      data: transfer,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/warehouse-transfers/5',
      expect.objectContaining({ method: 'GET', cache: 'no-store' })
    );
  });

  it('patches the latest version with replacement entries and status', async () => {
    const fetchMock = vi.mocked(fetch);
    const transfer = { id: 5, status: TRANSFER_STATUS.IN_TRANSIT, version: 2 };
    fetchMock.mockResolvedValue(new Response(JSON.stringify(transfer)));

    await expect(
      updateTransfer({
        transferId: 5,
        expectedVersion: 1,
        comment: null,
        status: TRANSFER_STATUS.IN_TRANSIT,
        transferEntries: [
          { productVariantId: 11, unitOfMeasurementId: 4, quantity: 3 },
        ],
      })
    ).resolves.toEqual({ ok: true, data: transfer });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/warehouse-transfers/5',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({
          expectedVersion: 1,
          comment: null,
          status: TRANSFER_STATUS.IN_TRANSIT,
          transferEntries: [
            { productVariantId: 11, unitOfMeasurementId: 4, quantity: 3 },
          ],
        }),
      })
    );
  });

  it('deletes a transfer through the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue(new Response(null, { status: 200 }));

    await expect(deleteTransfer(5)).resolves.toMatchObject({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/warehouse-transfers/5',
      expect.objectContaining({ method: 'DELETE' })
    );
  });
});
