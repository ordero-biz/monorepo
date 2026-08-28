import { updateWarehouse } from '@/lib/client/api/warehouses';
import { submitUpdateWarehouse } from './submitAction';

vi.mock('@/lib/client/api/warehouses', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/warehouses')>(
    '@/lib/client/api/warehouses'
  )),
  updateWarehouse: vi.fn(),
}));

const updateWarehouseMock = vi.mocked(updateWarehouse);

const warehouse = {
  id: 1,
  name: 'Main Warehouse',
  address: '123 Commerce Ave',
  comment: 'Primary stock location',
};

describe('submitUpdateWarehouse', () => {
  beforeEach(() => {
    updateWarehouseMock.mockReset();
  });

  it('submits only the changed normalized fields', async () => {
    updateWarehouseMock.mockResolvedValue({
      ok: true,
      data: {
        ...warehouse,
        name: 'Central Warehouse',
      },
    });

    await expect(
      submitUpdateWarehouse({
        warehouseId: 1,
        submitData: { name: 'Central Warehouse' },
      })
    ).resolves.toEqual({
      ok: true,
      data: {
        ...warehouse,
        name: 'Central Warehouse',
      },
    });

    expect(updateWarehouseMock).toHaveBeenCalledWith({
      warehouseId: 1,
      name: 'Central Warehouse',
    });
  });

  it('maps backend errors to submit action errors', async () => {
    updateWarehouseMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Warehouse update failed.',
        fieldErrors: {
          name: 'Warehouse name already exists.',
        },
      },
    });

    await expect(
      submitUpdateWarehouse({
        warehouseId: 1,
        submitData: { name: 'Central Warehouse' },
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        fieldErrors: {
          name: 'Warehouse name already exists.',
        },
        formError: 'Warehouse update failed.',
      },
    });
  });
});
