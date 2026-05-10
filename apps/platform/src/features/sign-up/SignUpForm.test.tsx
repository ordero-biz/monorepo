import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { preparePlatformSetup } from '@/test/prepareSetup';
import { SignUpForm } from './SignUpForm';

const { setup } = preparePlatformSetup({
  component: SignUpForm,
});

const setupSignUpForm = () => {
  const user = userEvent.setup();

  setup();

  return {
    emailField: screen.getByRole('textbox', { name: 'Email address' }),
    passwordField: screen.getByPlaceholderText('6+ characters'),
    signUpButton: screen.getByRole('button', { name: 'Sign up' }),
    termsCheckbox: screen.getByRole('checkbox', {
      name: /by signing up, i agree to/i,
    }),
    user,
  };
};

describe('SignUpForm', () => {
  it('renders the expected form controls', () => {
    const { emailField, passwordField, signUpButton, termsCheckbox } =
      setupSignUpForm();

    expect(emailField).toBeVisible();
    expect(passwordField).toBeVisible();
    expect(signUpButton).toHaveAttribute('type', 'submit');
    expect(termsCheckbox).not.toBeChecked();
    expect(screen.getByRole('link', { name: 'terms of use' })).toHaveAttribute(
      'href',
      '/terms'
    );
    expect(
      screen.getByRole('link', { name: 'privacy policy' })
    ).toHaveAttribute('href', '/privacy');
  });

  it('does not show client email validation on the first keystroke', async () => {
    const { emailField, user } = setupSignUpForm();

    await user.type(emailField, 'x');

    expect(
      screen.queryByText('Enter a valid email address.')
    ).not.toBeInTheDocument();
  });

  it('shows client email validation after the user blurs the field once', async () => {
    const { emailField, passwordField, user } = setupSignUpForm();

    await user.type(emailField, 'x');
    await user.click(passwordField);

    expect(screen.getByText('Enter a valid email address.')).toBeVisible();
  });

  it('updates email validity live after an invalid field has been revealed', async () => {
    const { emailField, passwordField, user } = setupSignUpForm();

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
    const { passwordField, user } = setupSignUpForm();

    await user.type(passwordField, 'x');

    expect(
      screen.queryByText('Password must contain at least 6 characters.')
    ).not.toBeInTheDocument();
  });

  it('shows submit validation when the user submits the untouched form', async () => {
    const { emailField, passwordField, signUpButton, termsCheckbox, user } =
      setupSignUpForm();

    await user.click(signUpButton);

    expect(screen.getByText('Enter a valid email address.')).toBeVisible();
    expect(emailField).toHaveAccessibleDescription(
      'Enter a valid email address.'
    );
    expect(
      screen.getByText('Password must contain at least 6 characters.')
    ).toBeVisible();
    expect(passwordField).toHaveAccessibleDescription(
      'Password must contain at least 6 characters.'
    );
    expect(
      screen.getByText('You must accept the terms to continue.')
    ).toBeVisible();
    expect(termsCheckbox).not.toBeChecked();
  });

  it('shows client password validation after the user blurs the field once', async () => {
    const { emailField, passwordField, user } = setupSignUpForm();

    await user.type(passwordField, 'x');
    await user.click(emailField);

    expect(
      screen.getByText('Password must contain at least 6 characters.')
    ).toBeVisible();
  });

  it('updates password validity live after an invalid field has been revealed', async () => {
    const { emailField, passwordField, user } = setupSignUpForm();

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

  it('shows checkbox validation when the user submits without accepting terms', async () => {
    const { emailField, passwordField, signUpButton, user } = setupSignUpForm();

    await user.type(emailField, 'admin@gmail.com');
    await user.type(passwordField, '123456');
    await user.click(signUpButton);

    expect(
      screen.getByText('You must accept the terms to continue.')
    ).toBeVisible();
  });

  it('clears the checkbox validation after the user accepts terms following a failed submit', async () => {
    const { emailField, passwordField, signUpButton, termsCheckbox, user } =
      setupSignUpForm();

    await user.type(emailField, 'admin@gmail.com');
    await user.type(passwordField, '123456');
    await user.click(signUpButton);

    expect(
      screen.getByText('You must accept the terms to continue.')
    ).toBeVisible();

    await user.click(termsCheckbox);

    expect(
      screen.queryByText('You must accept the terms to continue.')
    ).not.toBeInTheDocument();
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
