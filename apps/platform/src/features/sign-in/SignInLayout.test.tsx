import { render, screen } from '@testing-library/react';
import { SignInFormLayout } from './SignInLayout';

describe('SignInFormLayout', () => {
  it('renders the auth layout copy, footer link, and sign-in form', () => {
    render(<SignInFormLayout />);

    expect(
      screen.getByRole('heading', { name: 'Welcome back!' })
    ).toBeVisible();
    expect(
      screen.getByText('Please enter your details to get started')
    ).toBeVisible();
    expect(
      screen.getByRole('link', { name: 'Create account' })
    ).toHaveAttribute('href', '/sign-up');
    expect(
      screen.getByRole('textbox', { name: 'Email address' })
    ).toBeVisible();
    expect(screen.getByLabelText(/Password/)).toBeVisible();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });
});
