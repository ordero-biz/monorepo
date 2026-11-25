import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareFormHookTestSetup } from '@/test/prepareFormHookTestSetup';
import {
  getAttributeUpdateChanges,
  submitUpdateAttribute,
} from '../utils/submitAction';
import { useUpdateAttributeForm } from './useUpdateAttributeForm';

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
  getAttributeUpdateChanges: vi.fn(),
  submitUpdateAttribute: vi.fn(),
}));

const getAttributeUpdateChangesMock = vi.mocked(getAttributeUpdateChanges);
const submitUpdateAttributeMock = vi.mocked(submitUpdateAttribute);

const { setup } = prepareFormHookTestSetup({
  hookProps: {
    attributeId: 7,
    initialName: 'Color',
    onNoChanges: vi.fn(),
    onUpdated: vi.fn(),
  },
  useFormHook: useUpdateAttributeForm,
});

const setupUpdateAttributeFormHook = () => {
  const user = userEvent.setup();
  const result = setup({
    hookProps: {
      attributeId: 7,
      initialName: 'Color',
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

describe('useUpdateAttributeForm', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    getAttributeUpdateChangesMock.mockReset();
    submitUpdateAttributeMock.mockReset();
  });

  it('submits changed fields and reports success', async () => {
    getAttributeUpdateChangesMock.mockReturnValue({ name: 'Material' });
    const updatedAttribute = {
      id: 7,
      name: 'Material',
      sortOrder: 10,
      status: 'DRAFT' as const,
      createdAt: '2026-06-25T18:13:29.608Z',
    };
    submitUpdateAttributeMock.mockResolvedValue({
      ok: true,
      data: updatedAttribute,
    });
    const { onNoChanges, onUpdated, submitButton, user } =
      setupUpdateAttributeFormHook();

    await user.click(submitButton);

    expect(getAttributeUpdateChangesMock).toHaveBeenCalledWith({
      formValue: { name: 'Color' },
      initialName: 'Color',
    });
    await waitFor(() =>
      expect(submitUpdateAttributeMock).toHaveBeenCalledWith({
        attributeId: 7,
        submitData: { name: 'Material' },
      })
    );
    expect(addToastMock).toHaveBeenCalledWith({
      description: 'Attribute Material was updated',
      type: 'success',
    });
    expect(onUpdated).toHaveBeenCalledWith(updatedAttribute);
    expect(onNoChanges).not.toHaveBeenCalled();
  });

  it('reports a no-op without submitting', async () => {
    getAttributeUpdateChangesMock.mockReturnValue(undefined);
    const { onNoChanges, onUpdated, submitButton, user } =
      setupUpdateAttributeFormHook();

    await user.click(submitButton);

    await waitFor(() => expect(onNoChanges).toHaveBeenCalledOnce());
    expect(submitUpdateAttributeMock).not.toHaveBeenCalled();
    expect(onUpdated).not.toHaveBeenCalled();
    expect(addToastMock).not.toHaveBeenCalled();
  });

  it('shows a toast and does not report success when submit fails', async () => {
    getAttributeUpdateChangesMock.mockReturnValue({ name: 'Material' });
    submitUpdateAttributeMock.mockResolvedValue({
      ok: false,
      error: {
        fieldErrors: { name: 'Attribute name already exists.' },
        formError: 'Attribute update failed.',
      },
    });
    const { onNoChanges, onUpdated, submitButton, user } =
      setupUpdateAttributeFormHook();

    await user.click(submitButton);

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Attribute update failed.',
        type: 'error',
      })
    );
    expect(onUpdated).not.toHaveBeenCalled();
    expect(onNoChanges).not.toHaveBeenCalled();
  });
});
