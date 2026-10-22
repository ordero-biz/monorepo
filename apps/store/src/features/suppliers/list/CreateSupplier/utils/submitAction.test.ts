import { createSupplier } from '@/lib/client/api/suppliers';
import { API_ERROR_CODES } from '@/lib/constants/apiErrorCodes';
import { SUPPLIER_STATUS } from '@/lib/domain/suppliers/constants';
import { submitCreateSupplier } from './submitAction';

vi.mock('@/lib/client/api/suppliers', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/suppliers')>(
    '@/lib/client/api/suppliers'
  )),
  createSupplier: vi.fn(),
}));

const createSupplierMock = vi.mocked(createSupplier);

describe('submitCreateSupplier', () => {
  beforeEach(() => {
    createSupplierMock.mockReset();
  });

  it('normalizes form values before creating the supplier', async () => {
    const supplier = {
      id: 1,
      name: 'Fresh Farms',
      status: SUPPLIER_STATUS.DRAFT,
      email: 'orders@fresh.example',
      phone: '+1 555 0100',
      address: '123 Market St',
      comment: 'Preferred produce supplier',
    };
    createSupplierMock.mockResolvedValue({
      ok: true,
      data: supplier,
    });

    await expect(
      submitCreateSupplier({
        name: ' Fresh Farms ',
        status: SUPPLIER_STATUS.DRAFT,
        email: ' orders@fresh.example ',
        phone: ' +1 555 0100 ',
        address: ' 123 Market St ',
        comment: ' Preferred produce supplier ',
      })
    ).resolves.toEqual({
      ok: true,
      data: supplier,
    });

    expect(createSupplierMock).toHaveBeenCalledWith({
      name: 'Fresh Farms',
      status: SUPPLIER_STATUS.DRAFT,
      email: 'orders@fresh.example',
      phone: '+1 555 0100',
      address: '123 Market St',
      comment: 'Preferred produce supplier',
    });
  });

  it('maps backend errors to submit action errors', async () => {
    createSupplierMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Supplier creation failed.',
        fieldErrors: {
          email: 'Supplier email already exists.',
        },
      },
    });

    await expect(
      submitCreateSupplier({
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
        fieldErrors: {
          email: 'Supplier email already exists.',
        },
        formError: 'Supplier creation failed.',
      },
    });
  });

  it('maps a duplicate supplier name error to the shared message', async () => {
    createSupplierMock.mockResolvedValue({
      ok: false,
      error: {
        status: 409,
        code: API_ERROR_CODES.SUPPLIER_NAME_ALREADY_EXISTS,
        message: 'Conflict',
      },
    });

    await expect(
      submitCreateSupplier({
        name: 'Fresh Farms',
        status: SUPPLIER_STATUS.DRAFT,
        email: '',
        phone: '',
        address: '',
        comment: '',
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        fieldErrors: undefined,
        formError: 'Supplier name already exists.',
      },
    });
  });

  it('omits blank optional fields from the create request', async () => {
    createSupplierMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        name: 'Fresh Farms',
        status: SUPPLIER_STATUS.DRAFT,
        email: '',
        phone: '',
        address: '',
        comment: '',
      },
    });

    await submitCreateSupplier({
      name: 'Fresh Farms',
      status: SUPPLIER_STATUS.DRAFT,
      email: '',
      phone: '',
      address: '',
      comment: '',
    });

    expect(createSupplierMock).toHaveBeenCalledWith({
      name: 'Fresh Farms',
      status: SUPPLIER_STATUS.DRAFT,
    });
  });
});
