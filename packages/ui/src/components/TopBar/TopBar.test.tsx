import { prepareSetup } from '@ordero/test-config/react';
import { screen } from '@testing-library/react';
import { Bell, Search } from 'lucide-react';
import { TopBar } from '.';
import type { TopBarProps } from './types';

describe('TopBar', () => {
  const { setup } = prepareSetup<TopBarProps>({
    component: TopBar.Root,
    props: {},
  });

  it('renders a banner landmark users can find by role', () => {
    setup();

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('applies an id when provided', () => {
    const { id } = setup({ id: 'store-page-header' });

    expect(screen.getByRole('banner')).toHaveAttribute('id', id);
  });

  it('does not render side slots when no compound children are provided', () => {
    setup();

    expect(
      screen.queryByRole('button', { name: 'Search' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Notifications' })
    ).not.toBeInTheDocument();
  });

  it('supports compound composition with TopBar.Left and TopBar.Right', () => {
    setup({
      children: (
        <>
          <TopBar.Left>
            <button aria-label="Search" type="button">
              <Search aria-hidden="true" />
            </button>
          </TopBar.Left>
          <TopBar.Right>
            <button aria-label="Notifications" type="button">
              <Bell aria-hidden="true" />
            </button>
          </TopBar.Right>
        </>
      ),
    });

    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Notifications' })
    ).toBeInTheDocument();
  });
});
