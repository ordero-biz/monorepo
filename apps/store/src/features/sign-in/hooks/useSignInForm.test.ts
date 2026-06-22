import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareFormHookTestSetup } from '@/test/prepareFormHookTestSetup';
import { submitSignIn } from '../utils/submitAction';
import { useSignInForm } from './useSignInForm';

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
  submitSignIn: vi.fn(),
}));

const submitSignInMock = vi.mocked(submitSignIn);

const { setup } = prepareFormHookTestSetup({
  hookProps: {
    onSignedIn: vi.fn(),
  },
  useFormHook: useSignInForm,
});

const setupSignInFormHook = () => {
  const user = userEvent.setup();
  const hookProps = {
    onSignedIn: vi.fn(),
  };
  const result = setup({
    hookProps,
  });

  return {
    onSignedIn: result.hookProps.onSignedIn,
    submitButton: screen.getByRole('button', { name: 'Submit' }),
    user,
    ...result,
  };
};

describe('useSignInForm', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    submitSignInMock.mockReset();
  });

  it('reports the session after a successful submit', async () => {
    const session = {
      authenticated: true,
      user: {
        email: 'admin@gmail.com',
      },
    };
    submitSignInMock.mockResolvedValue({
      ok: true,
      data: session,
    });
    const { onSignedIn, submitButton, user } = setupSignInFormHook();

    await user.click(submitButton);

    await waitFor(() => expect(onSignedIn).toHaveBeenCalledWith(session));
  });

  it('shows a toast when submit fails with a form-level error', async () => {
    submitSignInMock.mockResolvedValue({
      ok: false,
      error: {
        fieldErrors: {
          email: 'Use a gmail.com email address.',
        },
        formError: 'Invalid credentials.',
      },
    });
    const { onSignedIn, submitButton, user } = setupSignInFormHook();

    await user.click(submitButton);

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Invalid credentials.',
        type: 'error',
      })
    );
    expect(onSignedIn).not.toHaveBeenCalled();
  });
});
