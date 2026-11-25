import { screen } from '@testing-library/react';
import { preparePlatformSetup } from '@/test/prepareSetup';
import { StoresListPage } from './StoresListPage';

vi.mock('./StoresListLayout', () => ({
  StoresListLayout: () => <div>Stores list layout</div>,
}));

const { setup } = preparePlatformSetup({
  component: StoresListPage,
});

describe('StoresListPage', () => {
  it('renders the stores list layout', () => {
    setup();

    expect(screen.getByText('Stores list layout')).toBeVisible();
  });
});
