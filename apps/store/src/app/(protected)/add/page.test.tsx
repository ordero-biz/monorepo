import { screen } from '@testing-library/react';
import { prepareStoreSetup } from '@/test/prepareSetup';
import AddProductPage from './page';

vi.mock('next/navigation', async () => ({
  ...(await vi.importActual<typeof import('next/navigation')>(
    'next/navigation'
  )),
  useRouter: () => ({ push: vi.fn() }),
}));

const { setup } = prepareStoreSetup({ component: AddProductPage });

describe('AddProductPage', () => {
  it('opens product setup with Single variant selected', () => {
    setup();

    expect(
      screen.getByRole('heading', { name: 'Create product' })
    ).toBeVisible();
    expect(screen.getByRole('radio', { name: 'Single variant' })).toBeChecked();
  });
});
