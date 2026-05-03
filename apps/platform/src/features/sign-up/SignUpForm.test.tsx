import { prepareSetup } from '@ordero/test-config/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignUpForm } from './SignUpForm';

const { setup } = prepareSetup({
  component: SignUpForm,
});

const setupSignUpForm = () => {
  const user = userEvent.setup();

  setup();

  return {
    emailField: screen.getByRole('textbox', { name: 'Email address' }),
    passwordField: screen.getByLabelText('Password'),
    signUpButton: screen.getByRole('button', { name: 'Sign up' }),
    termsCheckbox: screen.getByRole('checkbox', {
      name: /by signing up, i agree to/i,
    }),
    user,
  };
};

describe('SignUpForm', () => {
  it('renders the expected form controls', () => {
    const { signUpButton, termsCheckbox } = setupSignUpForm();

    expect(signUpButton).toHaveAttribute('type', 'submit');
    expect(termsCheckbox).not.toBeChecked();
    expect(
      screen.getByRole('link', { name: 'terms of use' })
    ).toHaveAttribute('href', '/terms');
    expect(
      screen.getByRole('link', { name: 'privacy policy' })
    ).toHaveAttribute('href', '/privacy');
  });

  it('shows checkbox validation when the user submits without accepting terms', async () => {
    const { emailField, passwordField, signUpButton, user } = setupSignUpForm();

    await user.type(emailField, 'admin@gmail.com');
    await user.type(passwordField, '123456');
    await user.click(signUpButton);

    expect(
      screen.getByText('You must accept the terms to continue.')
    ).toBeVisible();
  });

  it('keeps the email and clears the password after successful sign up', async () => {
    const { emailField, passwordField, signUpButton, termsCheckbox, user } =
      setupSignUpForm();

    await user.type(emailField, 'admin@gmail.com');
    await user.type(passwordField, '123456');
    await user.click(termsCheckbox);
    await user.click(signUpButton);

    expect(emailField).toHaveValue('admin@gmail.com');
    expect(passwordField).toHaveValue('');
    expect(termsCheckbox).not.toBeChecked();
  });
});
