import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareFormHookTestSetup } from '@/test/prepareFormHookTestSetup';
import { getWarehouseUpdateChanges } from '../utils/getUpdateChanges';
import { submitUpdateWarehouse } from '../utils/submitAction';
import { useUpdateWarehouseForm } from './useUpdateWarehouseForm';

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
  submitUpdateWarehouse: vi.fn(),
}));

vi.mock('../utils/getUpdateChanges', () => ({
  getWarehouseUpdateChanges: vi.fn(),
}));

const getWarehouseUpdateChangesMock = vi.mocked(getWarehouseUpdateChanges);
const submitUpdateWarehouseMock = vi.mocked(submitUpdateWarehouse);

const warehouse = {
  id: 1,
  name: 'Main Warehouse',
  address: '123 Commerce Ave',
  comment: 'Primary stock location',
};

const { setup } = prepareFormHookTestSetup({
  hookProps: {
    onNoChanges: vi.fn(),
    onUpdated: vi.fn(),
    warehouse,
  },
  useFormHook: useUpdateWarehouseForm,
});

const setupUpdateWarehouseFormHook = () => {
  const user = userEvent.setup();
  const hookProps = {
    onNoChanges: vi.fn(),
    onUpdated: vi.fn(),
    warehouse,
  };
  const result = setup({
    hookProps,
  });

  return {
    ...result,
    onNoChanges: result.hookProps.onNoChanges,
    onUpdated: result.hookProps.onUpdated,
    submitButton: screen.getByRole('button', { name: 'Submit' }),
    user,
  };
};

describe('useUpdateWarehouseForm', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    getWarehouseUpdateChangesMock.mockReset();
    submitUpdateWarehouseMock.mockReset();
  });

  it('closes without a request when the normalized values are unchanged', async () => {
    getWarehouseUpdateChangesMock.mockReturnValue(undefined);
    const { onNoChanges, onUpdated, submitButton, user } =
      setupUpdateWarehouseFormHook();

    await user.click(submitButton);

    await waitFor(() => expect(onNoChanges).toHaveBeenCalled());
    expect(submitUpdateWarehouseMock).not.toHaveBeenCalled();
    expect(onUpdated).not.toHaveBeenCalled();
  });

  it('shows a toast when submit fails with a form-level error', async () => {
    getWarehouseUpdateChangesMock.mockReturnValue({
      name: 'Central Warehouse',
    });
    submitUpdateWarehouseMock.mockResolvedValue({
      ok: false,
      error: {
        fieldErrors: {
          name: 'Warehouse name already exists.',
        },
        formError: 'Warehouse update failed.',
      },
    });
    const { onNoChanges, onUpdated, submitButton, user } =
      setupUpdateWarehouseFormHook();

    await user.click(submitButton);

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Warehouse update failed.',
        type: 'error',
      })
    );
    expect(onNoChanges).not.toHaveBeenCalled();
    expect(onUpdated).not.toHaveBeenCalled();
  });
});
