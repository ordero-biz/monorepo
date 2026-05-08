import { render, screen, within } from '@testing-library/react';
import { Bell, Search } from 'lucide-react';
import { Header } from './Header';

describe('Header', () => {
  it('renders the banner root', () => {
    const { container } = render(<Header />);
    const leftContainer = container.querySelector('[data-slot="header-left"]');
    const rightContainer = container.querySelector(
      '[data-slot="header-right"]'
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(leftContainer).not.toBeInTheDocument();
    expect(rightContainer).not.toBeInTheDocument();
  });

  it('supports compound composition with Header.Left and Header.Right', () => {
    const { container } = render(
      <Header>
        <Header.Left>
          <button aria-label="Search" type="button">
            <Search aria-hidden="true" />
          </button>
        </Header.Left>
        <Header.Right>
          <button aria-label="Notifications" type="button">
            <Bell aria-hidden="true" />
          </button>
        </Header.Right>
      </Header>
    );

    const leftContainer = container.querySelector('[data-slot="header-left"]');
    const rightContainer = container.querySelector(
      '[data-slot="header-right"]'
    );

    expect(leftContainer).toBeInTheDocument();
    expect(rightContainer).toBeInTheDocument();

    expect(
      within(leftContainer as HTMLElement).getByRole('button', {
        name: 'Search',
      })
    ).toBeInTheDocument();
    expect(
      within(rightContainer as HTMLElement).getByRole('button', {
        name: 'Notifications',
      })
    ).toBeInTheDocument();
  });
});
