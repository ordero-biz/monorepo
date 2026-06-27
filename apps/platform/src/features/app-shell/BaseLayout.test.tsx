import { screen, within } from '@testing-library/react';
import { preparePlatformSetup } from '@/test/prepareSetup';
import { BaseLayout } from './BaseLayout';

vi.mock('@/lib/hooks/useLogOut', () => ({
  useLogOut: () => ({
    isLoggingOut: false,
    logOut: vi.fn(),
  }),
}));

const { setup } = preparePlatformSetup({
  component: BaseLayout,
  props: {
    children: <div>Platform content</div>,
  },
});

describe('BaseLayout', () => {
  it('renders the sidebar, page header, and page content', () => {
    setup();

    const sidebar = screen.getByRole('complementary');
    const main = screen.getByRole('main');

    expect(within(sidebar).getByText('Ordero')).toBeVisible();
    expect(within(sidebar).getByRole('link', { name: 'Stores' })).toBeVisible();
    expect(
      within(main).getByRole('heading', { name: 'Platform' })
    ).toBeVisible();
    expect(within(main).getByText('Platform content')).toBeVisible();
  });
});
