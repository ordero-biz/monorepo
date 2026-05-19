import { prepareSetup } from '@ordero/test-config/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignInForm } from './SignInForm';

const { setup } = prepareSetup({
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

  it('does not show client email validation on the first keystroke', async () => {
    const { emailField, user } = setupSignInForm();

    await user.type(emailField, 'x');

    expect(
      screen.queryByText('Enter a valid email address.')
    ).not.toBeInTheDocument();
  });

  it('shows client email validation after the user blurs the field once', async () => {
    const { emailField, passwordField, user } = setupSignInForm();

    await user.type(emailField, 'x');
    await user.click(passwordField);

    expect(screen.getByText('Enter a valid email address.')).toBeVisible();
  });

  it('updates email validity live after an invalid field has been revealed', async () => {
    const { emailField, passwordField, user } = setupSignInForm();

    await user.type(emailField, 'x');
    await user.click(passwordField);

    expect(screen.getByText('Enter a valid email address.')).toBeVisible();

    await user.clear(emailField);
    await user.type(emailField, 'admin@gmail.com');

    expect(
      screen.queryByText('Enter a valid email address.')
    ).not.toBeInTheDocument();
  });

  it('does not show client password validation on the first keystroke', async () => {
    const { passwordField, user } = setupSignInForm();

    await user.type(passwordField, 'x');

    expect(
      screen.queryByText('Password must contain at least 6 characters.')
    ).not.toBeInTheDocument();
  });

  it('shows client password validation after the user blurs the field once', async () => {
    const { emailField, passwordField, user } = setupSignInForm();

    await user.type(passwordField, 'x');
    await user.click(emailField);

    expect(
      screen.getByText('Password must contain at least 6 characters.')
    ).toBeVisible();
  });

  it('updates password validity live after an invalid field has been revealed', async () => {
    const { emailField, passwordField, user } = setupSignInForm();

    await user.type(passwordField, 'x');
    await user.click(emailField);

    expect(
      screen.getByText('Password must contain at least 6 characters.')
    ).toBeVisible();

    await user.clear(passwordField);
    await user.type(passwordField, '123456');

    expect(
      screen.queryByText('Password must contain at least 6 characters.')
    ).not.toBeInTheDocument();
  });

  it('shows the backend email error for a valid non-gmail address on submit', async () => {
    const { emailField, passwordField, signInButton, user } = setupSignInForm();

    await user.type(emailField, 'admin@mail.com');
    await user.type(passwordField, '123456');
    await user.click(signInButton);

    expect(screen.getByText('Use a gmail.com email address.')).toBeVisible();
    expect(emailField).toHaveAccessibleDescription(
      'Use a gmail.com email address.'
    );
    expect(passwordField).toHaveValue('123456');
  });

  it('keeps the email and clears the password after successful sign in', async () => {
    const { emailField, passwordField, signInButton, user } = setupSignInForm();

    await user.type(emailField, 'admin@gmail.com');
    await user.type(passwordField, '123456');
    await user.click(signInButton);

    expect(emailField).toHaveValue('admin@gmail.com');
    expect(passwordField).toHaveValue('');
  });
});
