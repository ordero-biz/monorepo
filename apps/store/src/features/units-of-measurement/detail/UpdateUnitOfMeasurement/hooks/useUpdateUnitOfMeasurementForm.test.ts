import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/units-of-measurement/constants';
import { prepareFormHookTestSetup } from '@/test/prepareFormHookTestSetup';
import { getUnitOfMeasurementUpdateChanges } from '../utils/getUpdateChanges';
import { submitUpdateUnitOfMeasurement } from '../utils/submitAction';
import { useUpdateUnitOfMeasurementForm } from './useUpdateUnitOfMeasurementForm';

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
  submitUpdateUnitOfMeasurement: vi.fn(),
}));

vi.mock('../utils/getUpdateChanges', () => ({
  getUnitOfMeasurementUpdateChanges: vi.fn(),
}));

const getUnitOfMeasurementUpdateChangesMock = vi.mocked(
  getUnitOfMeasurementUpdateChanges
);
const submitUpdateUnitOfMeasurementMock = vi.mocked(
  submitUpdateUnitOfMeasurement
);

const unitOfMeasurement = {
  id: 1,
  status: UNIT_OF_MEASUREMENT_STATUS.DRAFT,
  name: 'Kilogram',
  symbol: 'kg',
  comment: 'Weight unit',
};

const { setup } = prepareFormHookTestSetup({
  hookProps: {
    onNoChanges: vi.fn(),
    onUpdated: vi.fn(),
    unitOfMeasurement,
  },
  useFormHook: useUpdateUnitOfMeasurementForm,
});

const setupUpdateUnitOfMeasurementFormHook = () => {
  const user = userEvent.setup();
  const result = setup({
    hookProps: {
      onNoChanges: vi.fn(),
      onUpdated: vi.fn(),
      unitOfMeasurement,
    },
  });

  return {
    onNoChanges: result.hookProps.onNoChanges,
    onUpdated: result.hookProps.onUpdated,
    submitButton: screen.getByRole('button', { name: 'Submit' }),
    user,
  };
};

describe('useUpdateUnitOfMeasurementForm', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    getUnitOfMeasurementUpdateChangesMock.mockReset();
    submitUpdateUnitOfMeasurementMock.mockReset();
  });

  it('closes without a request when the normalized values are unchanged', async () => {
    getUnitOfMeasurementUpdateChangesMock.mockReturnValue(undefined);
    const { onNoChanges, onUpdated, submitButton, user } =
      setupUpdateUnitOfMeasurementFormHook();

    await user.click(submitButton);

    await waitFor(() => expect(onNoChanges).toHaveBeenCalled());
    expect(submitUpdateUnitOfMeasurementMock).not.toHaveBeenCalled();
    expect(onUpdated).not.toHaveBeenCalled();
  });

  it('submits changed fields before reporting success', async () => {
    getUnitOfMeasurementUpdateChangesMock.mockReturnValue({ symbol: null });
    submitUpdateUnitOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        status: 'ACTIVE',
        name: 'Gram',
        symbol: 'g',
        comment: 'Weight unit',
      },
    });
    const { onNoChanges, onUpdated, submitButton, user } =
      setupUpdateUnitOfMeasurementFormHook();

    await user.click(submitButton);

    await waitFor(() =>
      expect(submitUpdateUnitOfMeasurementMock).toHaveBeenCalledWith({
        unitOfMeasurementId: 1,
        submitData: { symbol: null },
      })
    );
    expect(addToastMock).toHaveBeenCalledWith({
      description: 'Unit of measurement Gram was updated',
      type: 'success',
    });
    expect(onNoChanges).not.toHaveBeenCalled();
    expect(onUpdated).toHaveBeenCalledWith({
      id: 1,
      status: 'ACTIVE',
      name: 'Gram',
      symbol: 'g',
      comment: 'Weight unit',
    });
  });

  it('shows a toast when submit fails with a form-level error', async () => {
    getUnitOfMeasurementUpdateChangesMock.mockReturnValue({ name: 'Gram' });
    submitUpdateUnitOfMeasurementMock.mockResolvedValue({
      ok: false,
      error: {
        fieldErrors: {
          code: 'Unit code already exists.',
        },
        formError: 'Unit of measurement update failed.',
      },
    });
    const { onNoChanges, onUpdated, submitButton, user } =
      setupUpdateUnitOfMeasurementFormHook();

    await user.click(submitButton);

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Unit of measurement update failed.',
        type: 'error',
      })
    );
    expect(onNoChanges).not.toHaveBeenCalled();
    expect(onUpdated).not.toHaveBeenCalled();
  });
});
