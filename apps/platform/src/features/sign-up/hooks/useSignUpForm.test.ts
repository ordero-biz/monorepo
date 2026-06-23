import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareFormHookTestSetup } from '@/test/prepareFormHookTestSetup';
import { submitSignUp } from '../utils/submitAction';
import { useSignUpForm } from './useSignUpForm';

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
  submitSignUp: vi.fn(),
}));

const submitSignUpMock = vi.mocked(submitSignUp);

const { setup } = prepareFormHookTestSetup({
  hookProps: {
    onSignedUp: vi.fn(),
  },
  useFormHook: useSignUpForm,
});

const setupSignUpFormHook = () => {
  const user = userEvent.setup();
  const hookProps = {
    onSignedUp: vi.fn(),
  };
  const result = setup({
    hookProps,
  });

  return {
    onSignedUp: result.hookProps.onSignedUp,
    submitButton: screen.getByRole('button', { name: 'Submit' }),
    user,
    ...result,
  };
};

describe('useSignUpForm', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    submitSignUpMock.mockReset();
  });

  it('reports the session after a successful submit', async () => {
    const session = {
      authenticated: true,
      user: {
        email: 'admin@gmail.com',
      },
    };
    submitSignUpMock.mockResolvedValue({
      ok: true,
      data: session,
    });
    const { onSignedUp, submitButton, user } = setupSignUpFormHook();

    await user.click(submitButton);

    await waitFor(() => expect(onSignedUp).toHaveBeenCalledWith(session));
  });

  it('shows a toast when submit fails with a form-level error', async () => {
    submitSignUpMock.mockResolvedValue({
      ok: false,
      error: {
        fieldErrors: {
          email: 'This email is already registered.',
        },
        formError: 'Unable to create account.',
      },
    });
    const { onSignedUp, submitButton, user } = setupSignUpFormHook();

    await user.click(submitButton);

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Unable to create account.',
        type: 'error',
      })
    );
    expect(onSignedUp).not.toHaveBeenCalled();
  });
});
