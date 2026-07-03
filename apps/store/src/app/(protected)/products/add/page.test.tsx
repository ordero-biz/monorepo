import { prepareSetup } from '@ordero/test-config/react';
import { screen } from '@testing-library/react';
import AddProductPage from './page';

const { setup } = prepareSetup({
  component: AddProductPage,
});

describe('AddProductPage', () => {
  it('renders the add product form', () => {
    setup();

    expect(screen.getByRole('heading', { name: 'Add product' })).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: 'Product name' })
    ).toHaveAttribute('placeholder', 'Product name');
    expect(screen.getByRole('textbox', { name: 'Product name' })).toHaveValue(
      ''
    );
    expect(
      screen.getByRole('combobox', { name: 'Category' })
    ).toHaveTextContent('Select category');
    expect(screen.getByRole('region', { name: 'Tips section' })).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Add product image' })
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Add product' })).toBeVisible();
  });
});
