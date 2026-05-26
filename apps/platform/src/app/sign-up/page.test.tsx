import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { clientRoutes } from '@/lib/client/routes';
import SignUpPage from './page';

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

vi.mock('@/features/sign-up/SignUpLayout', () => ({
  SignUpLayout: () => <div>Sign up form</div>,
}));

const getGuardMock = async () => {
  const module = await import('@/lib/api/authPageGuard');

  return vi.mocked(module.hasAuthenticatedServerSession);
};

describe('SignUpPage', () => {
  beforeEach(async () => {
    vi.mocked(redirect).mockClear();
    (await getGuardMock()).mockReset();
  });

  it('redirects authenticated users away from the sign-up page', async () => {
    (await getGuardMock()).mockResolvedValue(true);

    await expect(SignUpPage()).rejects.toThrow('redirect');
    expect(redirect).toHaveBeenCalledWith(clientRoutes.home);
  });

  it('renders the sign-up page for signed-out users', async () => {
    (await getGuardMock()).mockResolvedValue(false);

    render(await SignUpPage());

    expect(screen.getByTestId('auth-shell')).toBeVisible();
    expect(screen.getByText('Sign up form')).toBeVisible();
  });
});
