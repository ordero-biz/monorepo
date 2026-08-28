import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareFormHookTestSetup } from '@/test/prepareFormHookTestSetup';
import { submitCreateWarehouse } from '../utils/submitAction';
import { useCreateWarehouseForm } from './useCreateWarehouseForm';

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
  submitCreateWarehouse: vi.fn(),
}));

const submitCreateWarehouseMock = vi.mocked(submitCreateWarehouse);

const { setup } = prepareFormHookTestSetup({
  hookProps: {
    onCreated: vi.fn(),
  },
  useFormHook: useCreateWarehouseForm,
});

const setupCreateWarehouseFormHook = () => {
  const user = userEvent.setup();
  const result = setup({
    hookProps: {
      onCreated: vi.fn(),
    },
  });

  return {
    onCreated: result.hookProps.onCreated,
    submitButton: screen.getByRole('button', { name: 'Submit' }),
    user,
  };
};

describe('useCreateWarehouseForm', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    submitCreateWarehouseMock.mockReset();
  });

  it('reports the created warehouse after a successful submit', async () => {
    submitCreateWarehouseMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        name: 'Main Warehouse',
        address: '123 Commerce Ave',
        comment: 'Primary stock location',
      },
    });
    const { onCreated, submitButton, user } = setupCreateWarehouseFormHook();

    await user.click(submitButton);

    await waitFor(() => expect(onCreated).toHaveBeenCalled());
    expect(addToastMock).toHaveBeenCalledWith({
      description: 'Warehouse Main Warehouse was created',
      type: 'success',
    });
  });

  it('shows a toast when submit fails with a form-level error', async () => {
    submitCreateWarehouseMock.mockResolvedValue({
      ok: false,
      error: {
        fieldErrors: {
          name: 'Warehouse name already exists.',
        },
        formError: 'Warehouse creation failed.',
      },
    });
    const { onCreated, submitButton, user } = setupCreateWarehouseFormHook();

    await user.click(submitButton);

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Warehouse creation failed.',
        type: 'error',
      })
    );
    expect(onCreated).not.toHaveBeenCalled();
  });
});
