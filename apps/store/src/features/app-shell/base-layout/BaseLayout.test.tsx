import { screen, within } from '@testing-library/react';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { BaseLayout } from './BaseLayout';

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

vi.mock('@/lib/hooks/auth/useLogOut', () => ({
  useLogOut: () => ({
    isLoggingOut: false,
    logOut: vi.fn(),
  }),
}));

const { setup } = prepareStoreSetup({
  component: BaseLayout,
  props: {
    children: <div>Store content</div>,
  },
});

describe('Base layout', () => {
  it('renders the sidebar, page header, and page content', () => {
    setup();

    const sidebar = screen.getByRole('complementary');
    const main = screen.getByRole('main');

    expect(within(sidebar).getByText('Ordero')).toBeVisible();
    expect(
      within(sidebar).getByRole('link', { name: 'Dashboard' })
    ).toBeVisible();
    expect(within(main).getByRole('heading', { name: 'Store' })).toBeVisible();
    expect(within(main).getByText('Store content')).toBeVisible();
  });
});
