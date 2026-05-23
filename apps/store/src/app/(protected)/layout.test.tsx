import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import ProtectedLayout from './layout';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('redirect');
  }),
}));

vi.mock('@/lib/api/authPageGuard', () => ({
  hasAuthenticatedServerSession: vi.fn(),
}));

const getGuardMock = async () => {
  const module = await import('@/lib/api/authPageGuard');

  return vi.mocked(module.hasAuthenticatedServerSession);
};

describe('ProtectedLayout', () => {
  beforeEach(async () => {
    vi.mocked(redirect).mockClear();
    (await getGuardMock()).mockReset();
  });

  it('redirects unauthenticated users to sign in', async () => {
    (await getGuardMock()).mockResolvedValue(false);

    await expect(
      ProtectedLayout({ children: <div>Protected content</div> })
    ).rejects.toThrow('redirect');
    expect(redirect).toHaveBeenCalledWith('/sign-in');
  });

  it('renders protected content for authenticated users', async () => {
    (await getGuardMock()).mockResolvedValue(true);

    const element = await ProtectedLayout({
      children: <div>Protected content</div>,
    });

    render(element);

    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });
});
