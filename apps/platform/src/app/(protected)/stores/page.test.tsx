import { screen } from '@testing-library/react';
import { preparePlatformSetup } from '@/test/prepareSetup';
import StoresPage from './page';

vi.mock('@/features/stores', async () => ({
  ...(await vi.importActual<typeof import('@/features/stores')>(
    '@/features/stores'
  )),
  StoresListPage: () => <div>Stores list page</div>,
}));

const { setup } = preparePlatformSetup({
  component: StoresPage,
});

describe('StoresPage', () => {
  it('renders the stores feature page', () => {
    setup();

    expect(screen.getByText('Stores list page')).toBeVisible();
  });
});
