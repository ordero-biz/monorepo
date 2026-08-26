import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SUPPLIER_STATUS } from '@/lib/domain/suppliers';
import { prepareFormHookTestSetup } from '@/test/prepareFormHookTestSetup';
import { submitCreateSupplier } from '../utils/submitAction';
import { useCreateSupplierForm } from './useCreateSupplierForm';

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
  submitCreateSupplier: vi.fn(),
}));

const submitCreateSupplierMock = vi.mocked(submitCreateSupplier);

const { setup } = prepareFormHookTestSetup({
  hookProps: {
    onCreated: vi.fn(),
  },
  useFormHook: useCreateSupplierForm,
});

const setupCreateSupplierFormHook = () => {
  const user = userEvent.setup();
  const hookProps = {
    onCreated: vi.fn(),
  };
  const result = setup({
    hookProps,
  });

  return {
    ...result,
    onCreated: result.hookProps.onCreated,
    submitButton: screen.getByRole('button', { name: 'Submit' }),
    user,
  };
};

describe('useCreateSupplierForm', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    submitCreateSupplierMock.mockReset();
  });

  it('reports the created supplier after a successful submit', async () => {
    submitCreateSupplierMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        name: 'Fresh Farms',
        status: SUPPLIER_STATUS.DRAFT,
        email: 'orders@fresh.example',
        phone: '+1 555 0100',
        address: '123 Market St',
        comment: 'Preferred produce supplier',
      },
    });
    const { onCreated, submitButton, user } = setupCreateSupplierFormHook();

    await user.click(submitButton);

    await waitFor(() => expect(onCreated).toHaveBeenCalled());
    expect(addToastMock).toHaveBeenCalledWith({
      description: 'Supplier Fresh Farms was created',
      type: 'success',
    });
  });

  it('shows a toast when submit fails with a form-level error', async () => {
    submitCreateSupplierMock.mockResolvedValue({
      ok: false,
      error: {
        fieldErrors: {
          email: 'Supplier email already exists.',
        },
        formError: 'Supplier creation failed.',
      },
    });
    const { onCreated, submitButton, user } = setupCreateSupplierFormHook();

    await user.click(submitButton);

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Supplier creation failed.',
        type: 'error',
      })
    );
    expect(onCreated).not.toHaveBeenCalled();
  });
});
