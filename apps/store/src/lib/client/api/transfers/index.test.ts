import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import { createTransfer } from '.';

describe('transfer client helpers', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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
});
