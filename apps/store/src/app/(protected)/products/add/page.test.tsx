import { prepareSetup } from '@ordero/test-config/react';
import { screen } from '@testing-library/react';
import AddProductPage from './page';

const { setup } = prepareSetup({
  component: AddProductPage,
});

describe('AddProductPage', () => {
  it('renders the placeholder add product page', () => {
    setup();

    expect(screen.getByRole('heading', { name: 'Add product' })).toBeVisible();
    expect(screen.getByText('Product form placeholder.')).toBeVisible();
  });
});
