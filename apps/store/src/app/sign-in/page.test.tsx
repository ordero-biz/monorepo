import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { clientRoutes } from '@/lib/routes';
import SignInPage from './page';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('redirect');
  }),
}));

vi.mock('@/lib/api/authPageGuard', () => ({
  hasAuthenticatedServerSession: vi.fn(),
}));

vi.mock('@/features/auth/AuthPageShell', () => ({
  AuthPageShell: ({ children }: { children: ReactNode }) => (
    <div data-testid="auth-shell">{children}</div>
  ),
}));

vi.mock('@/features/sign-in/SignInLayout', () => ({
  SignInFormLayout: () => <div>Sign in form</div>,
}));

const getGuardMock = async () => {
  const module = await import('@/lib/api/authPageGuard');

  return vi.mocked(module.hasAuthenticatedServerSession);
};

describe('SignInPage', () => {
  beforeEach(async () => {
    vi.mocked(redirect).mockClear();
    (await getGuardMock()).mockReset();
  });

  it('redirects authenticated users away from the sign-in page', async () => {
    (await getGuardMock()).mockResolvedValue(true);

    await expect(SignInPage()).rejects.toThrow('redirect');
    expect(redirect).toHaveBeenCalledWith(clientRoutes.home);
  });

  it('renders the sign-in page for signed-out users', async () => {
    (await getGuardMock()).mockResolvedValue(false);

    render(await SignInPage());

    expect(screen.getByTestId('auth-shell')).toBeVisible();
    expect(screen.getByText('Sign in form')).toBeVisible();
  });
});
