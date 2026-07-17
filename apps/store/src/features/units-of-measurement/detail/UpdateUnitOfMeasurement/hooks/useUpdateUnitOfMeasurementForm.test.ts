import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareFormHookTestSetup } from '@/test/prepareFormHookTestSetup';
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

const submitUpdateUnitOfMeasurementMock = vi.mocked(
  submitUpdateUnitOfMeasurement
);

const { setup } = prepareFormHookTestSetup({
  hookProps: {
    initialValues: {
      code: 'KG',
      name: 'Kilogram',
      symbol: 'kg',
      comment: 'Weight unit',
    },
    onUpdated: vi.fn(),
    unitOfMeasurementId: 1,
  },
  useFormHook: useUpdateUnitOfMeasurementForm,
});

const setupUpdateUnitOfMeasurementFormHook = () => {
  const user = userEvent.setup();
  const result = setup({
    hookProps: {
      initialValues: {
        code: 'KG',
        name: 'Kilogram',
        symbol: 'kg',
        comment: 'Weight unit',
      },
      onUpdated: vi.fn(),
      unitOfMeasurementId: 1,
    },
  });

  return {
    onUpdated: result.hookProps.onUpdated,
    submitButton: screen.getByRole('button', { name: 'Submit' }),
    user,
  };
};

describe('useUpdateUnitOfMeasurementForm', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    submitUpdateUnitOfMeasurementMock.mockReset();
  });

  it('submits the unit id and initial form values before reporting success', async () => {
    submitUpdateUnitOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        code: 'G',
        name: 'Gram',
        symbol: 'g',
        comment: 'Weight unit',
      },
    });
    const { onUpdated, submitButton, user } =
      setupUpdateUnitOfMeasurementFormHook();

    await user.click(submitButton);

    await waitFor(() =>
      expect(submitUpdateUnitOfMeasurementMock).toHaveBeenCalledWith({
        unitOfMeasurementId: 1,
        value: {
          code: 'KG',
          name: 'Kilogram',
          symbol: 'kg',
          comment: 'Weight unit',
        },
      })
    );
    expect(addToastMock).toHaveBeenCalledWith({
      description: 'Unit of measurement Gram was updated',
      type: 'success',
    });
    expect(onUpdated).toHaveBeenCalledWith({
      id: 1,
      code: 'G',
      name: 'Gram',
      symbol: 'g',
      comment: 'Weight unit',
    });
  });

  it('shows a toast when submit fails with a form-level error', async () => {
    submitUpdateUnitOfMeasurementMock.mockResolvedValue({
      ok: false,
      error: {
        fieldErrors: {
          code: 'Unit code already exists.',
        },
        formError: 'Unit of measurement update failed.',
      },
    });
    const { onUpdated, submitButton, user } =
      setupUpdateUnitOfMeasurementFormHook();

    await user.click(submitButton);

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Unit of measurement update failed.',
        type: 'error',
      })
    );
    expect(onUpdated).not.toHaveBeenCalled();
  });
});
