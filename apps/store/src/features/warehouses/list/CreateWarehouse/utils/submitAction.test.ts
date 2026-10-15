import { createWarehouse } from '@/lib/client/api/warehouses';
import { API_ERROR_CODES } from '@/lib/constants/apiErrorCodes';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
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
        name: ' Main Warehouse ',
        address: ' 123 Commerce Ave ',
        comment: ' Primary stock location ',
        status: WAREHOUSE_STATUS.ACTIVE,
      })
    ).resolves.toEqual({
      ok: true,
      data: warehouse,
    });

    expect(createWarehouseMock).toHaveBeenCalledWith({
      name: 'Main Warehouse',
      address: '123 Commerce Ave',
      comment: 'Primary stock location',
      status: WAREHOUSE_STATUS.ACTIVE,
    });
  });

  it('maps backend errors to submit action errors', async () => {
    createWarehouseMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Warehouse creation failed.',
        fieldErrors: {
          name: 'Warehouse name already exists.',
        },
      },
    });

    await expect(
      submitCreateWarehouse({
        name: 'Main Warehouse',
        address: '123 Commerce Ave',
        comment: '',
        status: WAREHOUSE_STATUS.DRAFT,
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        fieldErrors: {
          name: 'Warehouse name already exists.',
        },
        formError: 'Warehouse creation failed.',
      },
    });
  });

  it('maps a duplicate warehouse name error to the shared message', async () => {
    createWarehouseMock.mockResolvedValue({
      ok: false,
      error: {
        status: 409,
        code: API_ERROR_CODES.WAREHOUSE_NAME_ALREADY_EXISTS,
        message: 'Conflict',
      },
    });

    await expect(
      submitCreateWarehouse({
        name: 'Main Warehouse',
        address: '',
        comment: '',
        status: WAREHOUSE_STATUS.DRAFT,
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        fieldErrors: undefined,
        formError: 'Warehouse name already exists.',
      },
    });
  });

  it('omits a blank optional address from the create request', async () => {
    createWarehouseMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        name: 'Main Warehouse',
        comment: '',
      },
    });

    await submitCreateWarehouse({
      name: 'Main Warehouse',
      address: '',
      comment: '',
      status: WAREHOUSE_STATUS.DRAFT,
    });

    expect(createWarehouseMock).toHaveBeenCalledWith({
      name: 'Main Warehouse',
      comment: '',
      status: WAREHOUSE_STATUS.DRAFT,
    });
  });
});
