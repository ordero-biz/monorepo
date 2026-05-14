import { render, screen } from '@testing-library/react';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { SignInFormLayout } from './SignInLayout';

describe('SignInFormLayout', () => {
  it('renders the auth layout copy, footer link, and sign-in form', () => {
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);

    render(
      <TestQueryProvider>
        <SignInFormLayout />
      </TestQueryProvider>
    );

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
