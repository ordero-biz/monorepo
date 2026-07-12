import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareFormHookTestSetup } from '@/test/prepareFormHookTestSetup';
import { submitAddStore } from '../utils/submitAction';
import { useAddStoreForm } from './useAddStoreForm';

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
  submitAddStore: vi.fn(),
}));

const submitAddStoreMock = vi.mocked(submitAddStore);

const { setup } = prepareFormHookTestSetup({
  hookProps: {
    onCreated: vi.fn(),
  },
  useFormHook: useAddStoreForm,
});

const setupAddStoreFormHook = () => {
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

describe('useAddStoreForm', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    submitAddStoreMock.mockReset();
  });

  it('runs the created callback after a successful submit', async () => {
    submitAddStoreMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        name: 'North Shop',
        subDomain: 'north-shop',
      },
    });
    const { onCreated, submitButton, user } = setupAddStoreFormHook();

    await user.click(submitButton);

    await waitFor(() => expect(onCreated).toHaveBeenCalledTimes(1));
    expect(addToastMock).toHaveBeenCalledWith({
      description: 'Store created.',
      type: 'success',
    });
  });

  it('shows a toast when submit fails with a form-level error', async () => {
    submitAddStoreMock.mockResolvedValue({
      ok: false,
      error: {
        fieldErrors: {
          subDomain: 'Subdomain is already taken.',
        },
        formError: 'Validation failed.',
      },
    });
    const { onCreated, submitButton, user } = setupAddStoreFormHook();

    await user.click(submitButton);

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Validation failed.',
        type: 'error',
      })
    );
    expect(onCreated).not.toHaveBeenCalled();
  });
});
