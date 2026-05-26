import { render, screen } from '@testing-library/react';
import { clientRoutes } from '@/lib/client/routes';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { SignInFormLayout } from './SignInLayout';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

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
    ).toHaveAttribute('href', clientRoutes.signUp);
    expect(
      screen.getByRole('textbox', { name: 'Email address' })
    ).toBeVisible();
    expect(screen.getByLabelText(/Password/)).toBeVisible();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });
});
