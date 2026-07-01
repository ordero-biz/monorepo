import { screen } from '@testing-library/react';
import { clientRoutes } from '@/lib/client/routes';
import { preparePlatformSetup } from '@/test/prepareSetup';
import { SignUpLayout } from './SignUpLayout';

vi.mock('@/lib/client/api/auth', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/auth')>(
    '@/lib/client/api/auth'
  )),
  signUp: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const { setup } = preparePlatformSetup({
  component: SignUpLayout,
});

describe('SignUpLayout', () => {
  it('renders the auth layout copy, footer link, and sign-up form', () => {
    setup();

    expect(screen.getByRole('heading', { name: 'Get started' })).toBeVisible();
    expect(
      screen.getByText('Please enter your details to get started')
    ).toBeVisible();
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      clientRoutes.signIn
    );
    expect(
      screen.getByRole('textbox', { name: 'Email address' })
    ).toBeVisible();
    expect(screen.getByLabelText(/Password/)).toBeVisible();
    expect(
      screen.getByRole('checkbox', { name: /by signing up, i agree to/i })
    ).not.toBeChecked();
    expect(
      screen.queryByText('You must accept the terms to continue.')
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'terms of use' })).toHaveAttribute(
      'href',
      clientRoutes.terms
    );
    expect(
      screen.getByRole('link', { name: 'privacy policy' })
    ).toHaveAttribute('href', clientRoutes.privacy);
    expect(screen.getByRole('button', { name: 'Sign up' })).toBeVisible();
  });
});
