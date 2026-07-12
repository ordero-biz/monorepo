import { screen } from '@testing-library/react';
import { preparePlatformSetup } from '@/test/prepareSetup';
import AddStoreRoutePage from './page';

vi.mock('@/features/stores', async () => ({
  ...(await vi.importActual<typeof import('@/features/stores')>(
    '@/features/stores'
  )),
  AddStorePage: () => <div>Add store page</div>,
}));

const { setup } = preparePlatformSetup({
  component: AddStoreRoutePage,
});

describe('AddStoreRoutePage', () => {
  it('renders the add-store feature page', () => {
    setup();

    expect(screen.getByText('Add store page')).toBeVisible();
  });
});
