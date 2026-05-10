import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import SignInPage from './sign-in/page';
import SignUpPage from './sign-up/page';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('redirect');
  }),
}));

vi.mock('@/lib/api/authPageGuard', () => ({
  hasAuthenticatedServerSession: vi.fn(),
}));

vi.mock('@/features/auth/AuthPageShell', () => ({
  AuthPageShell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-shell">{children}</div>
  ),
}));

vi.mock('@/features/sign-in/SignInLayout', () => ({
  SignInFormLayout: () => <div>Sign in form</div>,
}));

vi.mock('@/features/sign-up/SignUpLayout', () => ({
  SignUpLayout: () => <div>Sign up form</div>,
}));

const getGuardMock = async () => {
  const module = await import('@/lib/api/authPageGuard');

  return vi.mocked(module.hasAuthenticatedServerSession);
};

describe('auth pages', () => {
  beforeEach(async () => {
    vi.mocked(redirect).mockClear();
    (await getGuardMock()).mockReset();
  });

  it('redirects authenticated users away from the sign-in page', async () => {
    (await getGuardMock()).mockResolvedValue(true);

    await expect(SignInPage()).rejects.toThrow('redirect');
    expect(redirect).toHaveBeenCalledWith('/');
  });

  it('renders the sign-in page for signed-out users', async () => {
    (await getGuardMock()).mockResolvedValue(false);

    render(await SignInPage());

    expect(screen.getByTestId('auth-shell')).toBeVisible();
    expect(screen.getByText('Sign in form')).toBeVisible();
  });

  it('redirects authenticated users away from the sign-up page', async () => {
    (await getGuardMock()).mockResolvedValue(true);

    await expect(SignUpPage()).rejects.toThrow('redirect');
    expect(redirect).toHaveBeenCalledWith('/');
  });

  it('renders the sign-up page for signed-out users', async () => {
    (await getGuardMock()).mockResolvedValue(false);

    render(await SignUpPage());

    expect(screen.getByTestId('auth-shell')).toBeVisible();
    expect(screen.getByText('Sign up form')).toBeVisible();
  });
});
