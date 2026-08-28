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
      status: 'DRAFT',
      name: 'Kilogram',
      symbol: 'kg',
      comment: 'Weight unit',
    },
    onNoChanges: vi.fn(),
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
        status: 'DRAFT',
        name: 'Kilogram',
        symbol: 'kg',
        comment: 'Weight unit',
      },
      onNoChanges: vi.fn(),
      onUpdated: vi.fn(),
      unitOfMeasurementId: 1,
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
    submitUpdateUnitOfMeasurementMock.mockReset();
  });

  it('reports no changes without submitting the initial form values', async () => {
    const { onNoChanges, onUpdated, submitButton, user } =
      setupUpdateUnitOfMeasurementFormHook();

    await user.click(submitButton);

    await waitFor(() => expect(onNoChanges).toHaveBeenCalled());
    expect(submitUpdateUnitOfMeasurementMock).not.toHaveBeenCalled();
    expect(onUpdated).not.toHaveBeenCalled();
  });
});
