import { render, screen } from '@testing-library/react';
import ProtectedLayout from './layout';

const { requireAuthenticatedRouteMock } = vi.hoisted(() => ({
  requireAuthenticatedRouteMock: vi.fn<() => Promise<void>>(),
}));

vi.mock('@/lib/api/authPageGuard', () => ({
  requireAuthenticatedRoute: requireAuthenticatedRouteMock,
}));

describe('ProtectedLayout', () => {
  beforeEach(() => {
    requireAuthenticatedRouteMock.mockReset();
  });

  it('checks authentication before rendering protected content', async () => {
    requireAuthenticatedRouteMock.mockResolvedValue(undefined);

    render(await ProtectedLayout({ children: <div>Protected content</div> }));

    expect(requireAuthenticatedRouteMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Protected content')).toBeVisible();
  });
});
