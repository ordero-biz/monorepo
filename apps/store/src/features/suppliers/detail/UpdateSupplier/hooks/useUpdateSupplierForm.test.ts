import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SUPPLIER_STATUS } from '@/lib/domain/suppliers';
import { prepareFormHookTestSetup } from '@/test/prepareFormHookTestSetup';
import { submitUpdateSupplier } from '../utils/submitAction';
import { useUpdateSupplierForm } from './useUpdateSupplierForm';

const { addToastMock } = vi.hoisted(() => ({
  addToastMock: vi.fn(),
}));

vi.mock('@ordero/ui', async () => ({
  ...(await vi.importActual<typeof import('@ordero/ui')>('@ordero/ui')),
  useToastManager: () => ({
    add: addToastMock,
  }),
}));

vi.mock('../utils/submitAction', async () => ({
  ...(await vi.importActual<typeof import('../utils/submitAction')>(
    '../utils/submitAction'
  )),
  submitUpdateSupplier: vi.fn(),
}));

const submitUpdateSupplierMock = vi.mocked(submitUpdateSupplier);

const supplier = {
  id: 1,
  name: 'Fresh Farms',
  status: SUPPLIER_STATUS.DRAFT,
  email: 'orders@fresh.example',
  phone: '+1 555 0100',
  address: '123 Market St',
  comment: 'Preferred produce supplier',
};

const { setup } = prepareFormHookTestSetup({
  hookProps: {
    onUpdated: vi.fn(),
    supplier,
  },
  useFormHook: useUpdateSupplierForm,
});

const setupUpdateSupplierFormHook = () => {
  const user = userEvent.setup();
  const hookProps = {
    onUpdated: vi.fn(),
    supplier,
  };
  const result = setup({
    hookProps,
  });

  return {
    ...result,
    onUpdated: result.hookProps.onUpdated,
    submitButton: screen.getByRole('button', { name: 'Submit' }),
    user,
  };
};

describe('useUpdateSupplierForm', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    submitUpdateSupplierMock.mockReset();
  });

  it('submits the supplier id and default form values before reporting success', async () => {
    submitUpdateSupplierMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        name: 'Fresh Farms Updated',
        status: SUPPLIER_STATUS.DRAFT,
        email: 'orders.updated@fresh.example',
        phone: '+1 555 0101',
        address: '124 Market St',
        comment: 'Updated supplier',
      },
    });
    const { onUpdated, submitButton, user } = setupUpdateSupplierFormHook();

    await user.click(submitButton);

    await waitFor(() =>
      expect(submitUpdateSupplierMock).toHaveBeenCalledWith({
        supplierId: 1,
        value: {
          name: 'Fresh Farms',
          status: SUPPLIER_STATUS.DRAFT,
          email: 'orders@fresh.example',
          phone: '+1 555 0100',
          address: '123 Market St',
          comment: 'Preferred produce supplier',
        },
      })
    );
    expect(addToastMock).toHaveBeenCalledWith({
      description: 'Supplier Fresh Farms Updated was updated',
      type: 'success',
    });
    expect(onUpdated).toHaveBeenCalledWith({
      id: 1,
      name: 'Fresh Farms Updated',
      status: SUPPLIER_STATUS.DRAFT,
      email: 'orders.updated@fresh.example',
      phone: '+1 555 0101',
      address: '124 Market St',
      comment: 'Updated supplier',
    });
  });

  it('shows a toast when submit fails with a form-level error', async () => {
    submitUpdateSupplierMock.mockResolvedValue({
      ok: false,
      error: {
        fieldErrors: {
          email: 'Supplier email already exists.',
        },
        formError: 'Supplier update failed.',
      },
    });
    const { onUpdated, submitButton, user } = setupUpdateSupplierFormHook();

    await user.click(submitButton);

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Supplier update failed.',
        type: 'error',
      })
    );
    expect(onUpdated).not.toHaveBeenCalled();
  });
});
