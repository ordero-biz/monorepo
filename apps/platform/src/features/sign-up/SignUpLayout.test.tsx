import { render, screen } from '@testing-library/react';
import { SignUpLayout } from './SignUpLayout';

describe('SignUpLayout', () => {
  it('renders the auth layout copy, footer link, and sign-up form', () => {
    render(<SignUpLayout />);

    expect(screen.getByRole('heading', { name: 'Get started' })).toBeVisible();
    expect(
      screen.getByText('Please enter your details to get started')
    ).toBeVisible();
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      '/sign-in'
    );
    expect(
      screen.getByRole('textbox', { name: 'Email address' })
    ).toBeVisible();
    expect(screen.getByLabelText('Password')).toBeVisible();
    expect(
      screen.getByRole('checkbox', { name: /by signing up, i agree to/i })
    ).not.toBeChecked();
    expect(
      screen.queryByText('You must accept the terms to continue.')
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'terms of use' })
    ).toHaveAttribute('href', '/terms');
    expect(
      screen.getByRole('link', { name: 'privacy policy' })
    ).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('button', { name: 'Sign up' })).toBeVisible();
  });
});
