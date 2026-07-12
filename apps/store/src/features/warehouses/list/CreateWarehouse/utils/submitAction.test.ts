import { createWarehouse } from '@/lib/client/api/warehouses';
import { submitCreateWarehouse } from './submitAction';

vi.mock('@/lib/client/api/warehouses', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/warehouses')>(
    '@/lib/client/api/warehouses'
  )),
  createWarehouse: vi.fn(),
}));

const createWarehouseMock = vi.mocked(createWarehouse);

describe('submitCreateWarehouse', () => {
  beforeEach(() => {
    createWarehouseMock.mockReset();
  });

  it('normalizes form values before creating the warehouse', async () => {
    const warehouse = {
      id: 1,
      code: 'WH-001',
      name: 'Main Warehouse',
      address: '123 Commerce Ave',
      comment: 'Primary stock location',
    };
    createWarehouseMock.mockResolvedValue({
      ok: true,
      data: warehouse,
    });

    await expect(
      submitCreateWarehouse({
        code: ' WH-001 ',
        name: ' Main Warehouse ',
        address: ' 123 Commerce Ave ',
        comment: ' Primary stock location ',
      })
    ).resolves.toEqual({
      ok: true,
      data: warehouse,
    });

    expect(createWarehouseMock).toHaveBeenCalledWith({
      code: 'WH-001',
      name: 'Main Warehouse',
      address: '123 Commerce Ave',
      comment: 'Primary stock location',
    });
  });

  it('maps backend errors to submit action errors', async () => {
    createWarehouseMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Warehouse creation failed.',
        fieldErrors: {
          code: 'Warehouse code already exists.',
        },
      },
    });

    await expect(
      submitCreateWarehouse({
        code: 'WH-001',
        name: 'Main Warehouse',
        address: '123 Commerce Ave',
        comment: '',
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        fieldErrors: {
          code: 'Warehouse code already exists.',
        },
        formError: 'Warehouse creation failed.',
      },
    });
  });
});
