import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareFormHookTestSetup } from '@/test/prepareFormHookTestSetup';
import { submitCreateUnitOfMeasurement } from '../utils/submitAction';
import { useCreateUnitOfMeasurementForm } from './useCreateUnitOfMeasurementForm';

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
  submitCreateUnitOfMeasurement: vi.fn(),
}));

const submitCreateUnitOfMeasurementMock = vi.mocked(
  submitCreateUnitOfMeasurement
);

const { setup } = prepareFormHookTestSetup({
  hookProps: {
    onCreated: vi.fn(),
  },
  useFormHook: useCreateUnitOfMeasurementForm,
});

const setupCreateUnitOfMeasurementFormHook = () => {
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

describe('useCreateUnitOfMeasurementForm', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    submitCreateUnitOfMeasurementMock.mockReset();
  });

  it('reports the created unit of measurement after a successful submit', async () => {
    submitCreateUnitOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        status: 'DRAFT',
        name: 'Kilogram',
        symbol: 'kg',
        comment: 'Weight unit',
      },
    });
    const { onCreated, submitButton, user } =
      setupCreateUnitOfMeasurementFormHook();

    await user.click(submitButton);

    await waitFor(() => expect(onCreated).toHaveBeenCalled());
    expect(addToastMock).toHaveBeenCalledWith({
      description: 'Unit of measurement Kilogram was created',
      type: 'success',
    });
  });

  it('shows a toast when submit fails with a form-level error', async () => {
    submitCreateUnitOfMeasurementMock.mockResolvedValue({
      ok: false,
      error: {
        fieldErrors: {
          code: 'Unit code already exists.',
        },
        formError: 'Unit of measurement creation failed.',
      },
    });
    const { onCreated, submitButton, user } =
      setupCreateUnitOfMeasurementFormHook();

    await user.click(submitButton);

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Unit of measurement creation failed.',
        type: 'error',
      })
    );
    expect(onCreated).not.toHaveBeenCalled();
  });
});
