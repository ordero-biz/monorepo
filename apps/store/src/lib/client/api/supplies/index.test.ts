import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import {
  createSupply,
  getSupplies,
  getSuppliesPath,
  getSupply,
  updateSupply,
} from '.';

const supplyDetails = {
  id: 7,
  supplier: { id: 2, name: 'Fresh Farms', status: 'ACTIVE' },
  warehouse: { id: 3, name: 'Main warehouse', status: 'ACTIVE' },
  status: SUPPLY_STATUS.DRAFT,
  supplyNumber: 'SUP-007',
  supplierInvoiceNumber: 'INV-007',
  totalQuantity: 12,
  totalPrice: 48.5,
  version: 1,
  supplyEntries: [
    {
      id: 11,
      productVariant: { id: 21, name: 'Rice', sku: 'RICE-1' },
      unitOfMeasurement: { id: 4, name: 'Bag', status: 'ACTIVE' },
      quantity: 12,
      unitPrice: 4,
      comment: 'New batch',
    },
  ],
};

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

  it('gets a supply detail from the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue(new Response(JSON.stringify(supplyDetails)));

    await expect(getSupply(7)).resolves.toEqual({
      ok: true,
      data: supplyDetails,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/supplies/7',
      expect.objectContaining({ method: 'GET', cache: 'no-store' })
    );
  });

  it('posts a supply with nested entries through the backend proxy', async () => {
    const fetchMock = vi.mocked(fetch);
    const input = {
      supplierId: 2,
      warehouseId: 3,
      supplyNumber: 'SUP-007',
      supplierInvoiceNumber: 'INV-007',
      status: SUPPLY_STATUS.DRAFT,
      comment: 'First delivery',
      supplyEntries: [
        {
          productVariantId: 21,
          unitOfMeasurementId: 4,
          quantity: 12,
          unitPrice: 4,
          comment: 'New batch',
        },
      ],
    };
    fetchMock.mockResolvedValue(new Response(JSON.stringify(supplyDetails)));

    await expect(createSupply(input)).resolves.toEqual({
      ok: true,
      data: supplyDetails,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/supplies',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(input),
        cache: 'no-store',
      })
    );
  });

  it('preserves nested field errors when supply creation fails', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          code: 'INVALID_SUPPLY_ENTRY',
          message: 'Supply entry is invalid.',
          fieldErrors: {
            'supplyEntries[0].quantity': 'Quantity must be positive.',
          },
        }),
        { status: 422, statusText: 'Unprocessable Entity' }
      )
    );

    await expect(
      createSupply({
        supplierId: 2,
        warehouseId: 3,
        supplyNumber: 'SUP-007',
        status: SUPPLY_STATUS.DRAFT,
        supplyEntries: [
          {
            productVariantId: 21,
            unitOfMeasurementId: 4,
            quantity: 0,
            unitPrice: 4,
          },
        ],
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        status: 422,
        message: 'Supply entry is invalid.',
        code: 'INVALID_SUPPLY_ENTRY',
        fieldErrors: {
          'supplyEntries[0].quantity': 'Quantity must be positive.',
        },
      },
    });
  });

  it('patches the latest version with replacement entries and completion status', async () => {
    const fetchMock = vi.mocked(fetch);
    const completedSupply = {
      ...supplyDetails,
      status: SUPPLY_STATUS.COMPLETED,
      version: 2,
    };
    fetchMock.mockResolvedValue(new Response(JSON.stringify(completedSupply)));

    await expect(
      updateSupply({
        supplyId: 7,
        expectedVersion: 1,
        status: SUPPLY_STATUS.COMPLETED,
        supplyEntries: [
          {
            productVariantId: 21,
            unitOfMeasurementId: 4,
            quantity: 12,
            unitPrice: 4,
            comment: 'New batch',
          },
        ],
      })
    ).resolves.toEqual({ ok: true, data: completedSupply });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/api/v1/supplies/7',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({
          expectedVersion: 1,
          status: SUPPLY_STATUS.COMPLETED,
          supplyEntries: [
            {
              productVariantId: 21,
              unitOfMeasurementId: 4,
              quantity: 12,
              unitPrice: 4,
              comment: 'New batch',
            },
          ],
        }),
      })
    );
  });
});
