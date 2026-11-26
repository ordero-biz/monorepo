import { screen } from '@testing-library/react';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { ProductImageTableCell } from './ProductImageTableCell';

const { setup } = prepareStoreSetup({
  component: ProductImageTableCell,
});

describe('ProductImageTableCell', () => {
  it('renders the unavailable product image placeholder', () => {
    setup();

    expect(
      screen.getByRole('img', { name: 'Product image unavailable' })
    ).toBeVisible();
  });
});
