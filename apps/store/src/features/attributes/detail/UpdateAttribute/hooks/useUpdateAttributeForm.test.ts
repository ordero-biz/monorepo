import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareFormHookTestSetup } from '@/test/prepareFormHookTestSetup';
import { submitUpdateAttribute } from '../utils/submitAction';
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
  submitUpdateAttribute: vi.fn(),
}));

const submitUpdateAttributeMock = vi.mocked(submitUpdateAttribute);

const { setup } = prepareFormHookTestSetup({
  hookProps: {
    attributeId: 7,
    initialName: 'Color',
    onUpdated: vi.fn(),
  },
  useFormHook: useUpdateAttributeForm,
});

const setupUpdateAttributeFormHook = () => {
  const user = userEvent.setup();
  const hookProps = {
    attributeId: 7,
    initialName: 'Color',
    onUpdated: vi.fn(),
  };
  const result = setup({
    hookProps,
  });

  return {
    onUpdated: result.hookProps.onUpdated,
    submitButton: screen.getByRole('button', { name: 'Submit' }),
    user,
    ...result,
  };
};

describe('useUpdateAttributeForm', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    submitUpdateAttributeMock.mockReset();
  });

  it('submits the attribute id and default form values before reporting success', async () => {
    submitUpdateAttributeMock.mockResolvedValue({
      ok: true,
      data: {
        id: 7,
        name: 'Material',
        sortOrder: 10,
        createdAt: '2026-06-25T18:13:29.608Z',
      },
    });
    const { onUpdated, submitButton, user } = setupUpdateAttributeFormHook();

    await user.click(submitButton);

    await waitFor(() =>
      expect(submitUpdateAttributeMock).toHaveBeenCalledWith({
        attributeId: 7,
        value: {
          name: 'Color',
        },
      })
    );
    expect(addToastMock).toHaveBeenCalledWith({
      description: 'Attribute Material was updated',
      type: 'success',
    });
    expect(onUpdated).toHaveBeenCalledWith({
      id: 7,
      name: 'Material',
      sortOrder: 10,
      createdAt: '2026-06-25T18:13:29.608Z',
    });
  });

  it('shows a toast when submit fails with a form-level error', async () => {
    submitUpdateAttributeMock.mockResolvedValue({
      ok: false,
      error: {
        fieldErrors: {
          name: 'Attribute name already exists.',
        },
        formError: 'Attribute update failed.',
      },
    });
    const { onUpdated, submitButton, user } = setupUpdateAttributeFormHook();

    await user.click(submitButton);

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Attribute update failed.',
        type: 'error',
      })
    );
    expect(onUpdated).not.toHaveBeenCalled();
  });
});
