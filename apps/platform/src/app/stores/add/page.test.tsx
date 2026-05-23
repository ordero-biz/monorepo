import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import AddStoreRoutePage from './page';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('redirect');
  }),
}));

vi.mock('@/lib/api/authPageGuard', () => ({
  hasAuthenticatedServerSession: vi.fn(),
}));

vi.mock('@/features/stores/AddStorePage', () => ({
  AddStorePage: () => <div>Add store form</div>,
}));

const getGuardMock = async () => {
  const module = await import('@/lib/api/authPageGuard');

  return vi.mocked(module.hasAuthenticatedServerSession);
};

describe('AddStoreRoutePage', () => {
  beforeEach(async () => {
    vi.mocked(redirect).mockClear();
    (await getGuardMock()).mockReset();
  });

  it('redirects signed-out users to sign in', async () => {
    (await getGuardMock()).mockResolvedValue(false);

    await expect(AddStoreRoutePage()).rejects.toThrow('redirect');
    expect(redirect).toHaveBeenCalledWith('/sign-in');
  });

  it('renders the add-store form for authenticated users', async () => {
    (await getGuardMock()).mockResolvedValue(true);

    render(await AddStoreRoutePage());

    expect(screen.getByText('Add store form')).toBeVisible();
  });
});
