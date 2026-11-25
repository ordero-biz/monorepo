import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { clientRoutes } from '@/lib/client/routes';
import SignInPage from './page';

const { hasAuthenticatedServerSessionMock, redirectMock } = vi.hoisted(() => ({
  hasAuthenticatedServerSessionMock: vi.fn(),
  redirectMock: vi.fn(() => {
    throw new Error('redirect');
  }),
}));

vi.mock('next/navigation', async () => ({
  ...(await vi.importActual<typeof import('next/navigation')>(
    'next/navigation'
  )),
  redirect: redirectMock,
}));

vi.mock('@/lib/server/authPageGuard', () => ({
  hasAuthenticatedServerSession: hasAuthenticatedServerSessionMock,
}));

vi.mock('@/features/auth', async () => ({
  ...(await vi.importActual<typeof import('@/features/auth')>(
    '@/features/auth'
  )),
  AuthPageShell: ({ children }: { children: ReactNode }) => (
    <div data-testid="auth-shell">{children}</div>
  ),
}));

vi.mock('@/features/sign-in', async () => ({
  ...(await vi.importActual<typeof import('@/features/sign-in')>(
    '@/features/sign-in'
  )),
  SignInFormLayout: () => <div>Sign in form</div>,
}));

describe('SignInPage', () => {
  beforeEach(() => {
    redirectMock.mockClear();
    hasAuthenticatedServerSessionMock.mockReset();
  });

  it('redirects authenticated users away from the sign-in page', async () => {
    hasAuthenticatedServerSessionMock.mockResolvedValue(true);

    await expect(SignInPage()).rejects.toThrow('redirect');
    expect(redirectMock).toHaveBeenCalledWith(clientRoutes.attributes);
  });

  it('renders the sign-in page for signed-out users', async () => {
    hasAuthenticatedServerSessionMock.mockResolvedValue(false);

    render(await SignInPage());

    expect(screen.getByTestId('auth-shell')).toBeVisible();
    expect(screen.getByText('Sign in form')).toBeVisible();
  });
});
