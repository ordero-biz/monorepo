import { render, screen } from '@testing-library/react';
import { AuthFormLayout } from './AuthFormLayout';

describe('AuthFormLayout', () => {
  it('renders the auth copy and children without a sign-up footer', () => {
    render(
      <AuthFormLayout
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
    expect(screen.getByRole('button', { name: 'Child action' })).toBeVisible();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
