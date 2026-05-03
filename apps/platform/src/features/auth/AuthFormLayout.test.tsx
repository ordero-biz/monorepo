import { render, screen } from '@testing-library/react';
import { AuthFormLayout } from './AuthFormLayout';

describe('AuthFormLayout', () => {
  it('renders the auth copy, footer link, and children', () => {
    render(
      <AuthFormLayout
        footerHref="/sign-up"
        footerLabel="Create account"
        footerPrompt="Don't have an account?"
        subtitle="Please enter your details to get started"
        title="Welcome back!"
      >
        <button type="button">Child action</button>
      </AuthFormLayout>
    );

    expect(
      screen.getByRole('heading', { name: 'Welcome back!' })
    ).toBeVisible();
    expect(
      screen.getByText('Please enter your details to get started')
    ).toBeVisible();
    expect(screen.getByText("Don't have an account?")).toBeVisible();
    expect(
      screen.getByRole('link', { name: 'Create account' })
    ).toHaveAttribute('href', '/sign-up');
    expect(
      screen.getByRole('button', { name: 'Child action' })
    ).toBeVisible();
  });
});
