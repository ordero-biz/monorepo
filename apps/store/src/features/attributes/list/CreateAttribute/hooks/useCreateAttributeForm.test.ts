import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareFormHookTestSetup } from '@/test/prepareFormHookTestSetup';
import { submitCreateAttribute } from '../utils/submitAction';
import { useCreateAttributeForm } from './useCreateAttributeForm';

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
  submitCreateAttribute: vi.fn(),
}));

const submitCreateAttributeMock = vi.mocked(submitCreateAttribute);

const { setup } = prepareFormHookTestSetup({
  hookProps: {
    onCreated: vi.fn(),
  },
  useFormHook: useCreateAttributeForm,
});

const setupCreateAttributeFormHook = () => {
  const user = userEvent.setup();
  const hookProps = {
    onCreated: vi.fn(),
  };
  const result = setup({
    hookProps,
  });

  return {
    onCreated: result.hookProps.onCreated,
    submitButton: screen.getByRole('button', { name: 'Submit' }),
    user,
    ...result,
  };
};

describe('useCreateAttributeForm', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    submitCreateAttributeMock.mockReset();
  });

  it('reports the created id after a successful submit', async () => {
    submitCreateAttributeMock.mockResolvedValue({
      ok: true,
      data: {
        id: 7,
        name: 'Material',
        sortOrder: 10,
        createdAt: '2026-05-26T20:55:51.542Z',
      },
    });
    const { onCreated, submitButton, user } = setupCreateAttributeFormHook();

    await user.click(submitButton);

    await waitFor(() => expect(onCreated).toHaveBeenCalledWith(7));
    expect(addToastMock).toHaveBeenCalledWith({
      description: 'Attribute Material was added',
      type: 'success',
    });
  });

  it('shows a toast when submit fails with a form-level error', async () => {
    submitCreateAttributeMock.mockResolvedValue({
      ok: false,
      error: {
        fieldErrors: {
          name: 'Attribute name already exists.',
        },
        formError: 'Attribute creation failed.',
      },
    });
    const { onCreated, submitButton, user } = setupCreateAttributeFormHook();

    await user.click(submitButton);

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Attribute creation failed.',
        type: 'error',
      })
    );
    expect(onCreated).not.toHaveBeenCalled();
  });
});
