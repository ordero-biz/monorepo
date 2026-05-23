import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import StoresPage from './page';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('redirect');
  }),
}));

vi.mock('@/lib/api/authPageGuard', () => ({
  hasAuthenticatedServerSession: vi.fn(),
}));

vi.mock('@/features/stores/StoresListPage', () => ({
  StoresListPage: () => <div>Stores list</div>,
}));

const getGuardMock = async () => {
  const module = await import('@/lib/api/authPageGuard');

  return vi.mocked(module.hasAuthenticatedServerSession);
};

describe('StoresPage', () => {
  beforeEach(async () => {
    vi.mocked(redirect).mockClear();
    (await getGuardMock()).mockReset();
  });

  it('redirects signed-out users to sign in', async () => {
    (await getGuardMock()).mockResolvedValue(false);

    await expect(StoresPage()).rejects.toThrow('redirect');
    expect(redirect).toHaveBeenCalledWith('/sign-in');
  });

  it('renders the stores list for authenticated users', async () => {
    (await getGuardMock()).mockResolvedValue(true);

    render(await StoresPage());

    expect(screen.getByText('Stores list')).toBeVisible();
  });
});
