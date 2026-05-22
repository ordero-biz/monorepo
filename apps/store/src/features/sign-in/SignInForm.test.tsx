import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signIn } from '@/lib/api/client';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { SignInForm } from './SignInForm';

vi.mock('@/lib/api/client', async () => ({
  ...(await vi.importActual<typeof import('@/lib/api/client')>(
    '@/lib/api/client'
  )),
  signIn: vi.fn(),
}));

const signInMock = vi.mocked(signIn);

const { setup } = prepareStoreSetup({
  component: SignInForm,
});

const setupSignInForm = () => {
  const user = userEvent.setup();

  setup();

  return {
    emailField: screen.getByRole('textbox', { name: 'Email address' }),
    passwordField: screen.getByLabelText(/Password/),
    signInButton: screen.getByRole('button', { name: 'Sign in' }),
    user,
  };
};

describe('SignInForm', () => {
  beforeEach(() => {
    signInMock.mockReset();
  });

  it('renders the expected form controls and secondary actions', () => {
    const { emailField, passwordField, signInButton } = setupSignInForm();

    expect(emailField).toBeVisible();
    expect(passwordField).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Forgot password?' })
    ).toHaveAttribute('type', 'button');
    expect(signInButton).toHaveAttribute('type', 'submit');
  });

  it('shows submit validation when the user submits the untouched form', async () => {
    const { emailField, passwordField, signInButton, user } = setupSignInForm();

    await user.click(signInButton);

    expect(screen.getByText('Enter a valid email address.')).toBeVisible();
    expect(emailField).toHaveAccessibleDescription(
      'Enter a valid email address.'
    );
    expect(
      screen.getByText('Password must contain at least 6 characters.')
    ).toBeVisible();
    expect(passwordField).toHaveValue('');
  });

  it('shows the backend email error for a valid rejected address on submit', async () => {
    signInMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Sign-in failed.',
        fieldErrors: {
          email: 'Use a gmail.com email address.',
        },
      },
    });
    const { emailField, passwordField, signInButton, user } = setupSignInForm();

    await user.type(emailField, 'admin@mail.com');
    await user.type(passwordField, '123456');
    await user.click(signInButton);

    expect(signInMock).toHaveBeenCalledWith({
      email: 'admin@mail.com',
      password: '123456',
    });
    expect(screen.getByText('Use a gmail.com email address.')).toBeVisible();
    expect(emailField).toHaveAccessibleDescription(
      'Use a gmail.com email address.'
    );
    expect(passwordField).toHaveValue('123456');
  });

  it('submits credentials, keeps the email, and clears the password after successful sign in', async () => {
    signInMock.mockResolvedValue({
      ok: true,
      data: {
        authenticated: true,
        user: {
          email: 'admin@gmail.com',
        },
      },
    });
    const { emailField, passwordField, signInButton, user } = setupSignInForm();

    await user.type(emailField, 'admin@gmail.com');
    await user.type(passwordField, '123456');
    await user.click(signInButton);

    expect(signInMock).toHaveBeenCalledWith({
      email: 'admin@gmail.com',
      password: '123456',
    });
    expect(emailField).toHaveValue('admin@gmail.com');
    expect(passwordField).toHaveValue('');
  });

  it('shows a toast when sign in fails with a form-level backend error', async () => {
    signInMock.mockResolvedValue({
      ok: false,
      error: {
        status: 401,
        message: 'Invalid credentials.',
      },
    });
    const { emailField, passwordField, signInButton, user } = setupSignInForm();

    await user.type(emailField, 'admin@gmail.com');
    await user.type(passwordField, '123456');
    await user.click(signInButton);

    expect(
      await screen.findByRole('dialog', { name: 'Invalid credentials.' })
    ).toBeVisible();
    expect(passwordField).toHaveValue('123456');
  });
});
