import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { clientRoutes } from '@/lib/client/routes';
import SignUpPage from './page';

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
    <main>{children}</main>
  ),
}));

vi.mock('@/features/sign-up', async () => ({
  ...(await vi.importActual<typeof import('@/features/sign-up')>(
    '@/features/sign-up'
  )),
  SignUpLayout: () => <div>Sign up form</div>,
}));

describe('SignUpPage', () => {
  beforeEach(() => {
    redirectMock.mockClear();
    hasAuthenticatedServerSessionMock.mockReset();
  });

  it('redirects authenticated users away from the sign-up page', async () => {
    hasAuthenticatedServerSessionMock.mockResolvedValue(true);

    await expect(SignUpPage()).rejects.toThrow('redirect');
    expect(redirectMock).toHaveBeenCalledWith(clientRoutes.home);
  });

  it('renders the sign-up page for signed-out users', async () => {
    hasAuthenticatedServerSessionMock.mockResolvedValue(false);

    render(await SignUpPage());

    expect(screen.getByRole('main')).toBeVisible();
    expect(screen.getByText('Sign up form')).toBeVisible();
  });
});
