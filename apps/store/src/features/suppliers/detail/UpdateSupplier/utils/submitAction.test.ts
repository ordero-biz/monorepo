import { updateSupplier } from '@/lib/client/api/suppliers';
import { SUPPLIER_STATUS } from '@/lib/domain/suppliers/constants';
import { submitUpdateSupplier } from './submitAction';

vi.mock('@/lib/client/api/suppliers', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/suppliers')>(
    '@/lib/client/api/suppliers'
  )),
  updateSupplier: vi.fn(),
}));

const updateSupplierMock = vi.mocked(updateSupplier);

const supplier = {
  id: 1,
  name: 'Fresh Farms',
  status: SUPPLIER_STATUS.DRAFT,
  email: 'orders@fresh.example',
  phone: '+1 555 0100',
  address: '123 Market St',
  comment: 'Preferred produce supplier',
};

describe('submitUpdateSupplier', () => {
  beforeEach(() => {
    updateSupplierMock.mockReset();
  });

  it('submits the normalized changed fields', async () => {
    updateSupplierMock.mockResolvedValue({
      ok: true,
      data: {
        ...supplier,
        name: 'Fresh Farms Updated',
      },
    });

    await expect(
      submitUpdateSupplier({
        supplierId: 1,
        submitData: {
          name: 'Fresh Farms Updated',
        },
      })
    ).resolves.toEqual({
      ok: true,
      data: {
        ...supplier,
        name: 'Fresh Farms Updated',
      },
    });

    expect(updateSupplierMock).toHaveBeenCalledWith({
      supplierId: 1,
      name: 'Fresh Farms Updated',
    });
  });

  it('maps backend errors to submit action errors', async () => {
    updateSupplierMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Supplier update failed.',
        fieldErrors: {
          email: 'Supplier email already exists.',
        },
      },
    });

    await expect(
      submitUpdateSupplier({
        supplierId: 1,
        submitData: {
          email: 'orders@fresh.example',
        },
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        fieldErrors: {
          email: 'Supplier email already exists.',
        },
        formError: 'Supplier update failed.',
      },
    });
  });
});
