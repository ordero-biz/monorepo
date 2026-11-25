import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareFormHookTestSetup } from '@/test/prepareFormHookTestSetup';
import {
  getAttributeValueUpdateChanges,
  submitUpdateAttributeValue,
} from '../utils/submitAction';
import { useUpdateAttributeValueForm } from './useUpdateAttributeValueForm';

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
  getAttributeValueUpdateChanges: vi.fn(),
  submitUpdateAttributeValue: vi.fn(),
}));

const getAttributeValueUpdateChangesMock = vi.mocked(
  getAttributeValueUpdateChanges
);
const submitUpdateAttributeValueMock = vi.mocked(submitUpdateAttributeValue);

const { setup } = prepareFormHookTestSetup({
  hookProps: {
    attributeValueId: 3,
    initialName: 'Blue',
    initialSortOrder: 0,
    onNoChanges: vi.fn(),
    onUpdated: vi.fn(),
  },
  useFormHook: useUpdateAttributeValueForm,
});

const setupUpdateAttributeValueFormHook = () => {
  const user = userEvent.setup();
  const result = setup({
    hookProps: {
      attributeValueId: 3,
      initialName: 'Blue',
      initialSortOrder: 0,
      onNoChanges: vi.fn(),
      onUpdated: vi.fn(),
    },
  });

  return {
    ...result,
    onNoChanges: result.hookProps.onNoChanges,
    onUpdated: result.hookProps.onUpdated,
    submitButton: screen.getByRole('button', { name: 'Submit' }),
    user,
  };
};

describe('useUpdateAttributeValueForm', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    getAttributeValueUpdateChangesMock.mockReset();
    submitUpdateAttributeValueMock.mockReset();
  });

  it('submits changed fields and reports success', async () => {
    getAttributeValueUpdateChangesMock.mockReturnValue({ name: 'Navy' });
    const updatedAttributeValue = {
      id: 3,
      name: 'Navy',
      sortOrder: 0,
      createdAt: '2026-06-25T18:13:29.608Z',
    };
    submitUpdateAttributeValueMock.mockResolvedValue({
      ok: true,
      data: updatedAttributeValue,
    });
    const { onNoChanges, onUpdated, submitButton, user } =
      setupUpdateAttributeValueFormHook();

    await user.click(submitButton);

    expect(getAttributeValueUpdateChangesMock).toHaveBeenCalledWith({
      formValue: { name: 'Blue', sortOrder: 0 },
      initialName: 'Blue',
      initialSortOrder: 0,
    });
    await waitFor(() =>
      expect(submitUpdateAttributeValueMock).toHaveBeenCalledWith({
        attributeValueId: 3,
        submitData: { name: 'Navy' },
      })
    );
    expect(addToastMock).toHaveBeenCalledWith({
      description: 'Attribute value Navy was updated',
      type: 'success',
    });
    expect(onUpdated).toHaveBeenCalledWith(updatedAttributeValue);
    expect(onNoChanges).not.toHaveBeenCalled();
  });

  it('reports a no-op without submitting', async () => {
    getAttributeValueUpdateChangesMock.mockReturnValue(undefined);
    const { onNoChanges, onUpdated, submitButton, user } =
      setupUpdateAttributeValueFormHook();

    await user.click(submitButton);

    await waitFor(() => expect(onNoChanges).toHaveBeenCalledOnce());
    expect(submitUpdateAttributeValueMock).not.toHaveBeenCalled();
    expect(onUpdated).not.toHaveBeenCalled();
    expect(addToastMock).not.toHaveBeenCalled();
  });

  it('shows a toast and does not report success when submit fails', async () => {
    getAttributeValueUpdateChangesMock.mockReturnValue({ name: 'Navy' });
    submitUpdateAttributeValueMock.mockResolvedValue({
      ok: false,
      error: {
        fieldErrors: { name: 'Attribute value name already exists.' },
        formError: 'Attribute value update failed.',
      },
    });
    const { onNoChanges, onUpdated, submitButton, user } =
      setupUpdateAttributeValueFormHook();

    await user.click(submitButton);

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Attribute value update failed.',
        type: 'error',
      })
    );
    expect(onUpdated).not.toHaveBeenCalled();
    expect(onNoChanges).not.toHaveBeenCalled();
  });
});
