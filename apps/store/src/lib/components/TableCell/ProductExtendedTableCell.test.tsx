import { screen } from '@testing-library/react';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { ProductExtendedTableCell } from './ProductExtendedTableCell';

const { setup } = prepareStoreSetup({
  component: ProductExtendedTableCell,
  props: {
    name: 'Jasmine Rice 5kg',
    sku: 'RICE-5KG',
  },
});

describe('ProductExtendedTableCell', () => {
  it('renders the product image placeholder, name, and SKU', () => {
    setup();

    expect(
      screen.getByRole('img', { name: 'Product image unavailable' })
    ).toBeVisible();
    expect(screen.getByText('Jasmine Rice 5kg')).toBeVisible();
    expect(screen.getByText('RICE-5KG')).toBeVisible();
  });

  it('omits the SKU line when SKU is empty', () => {
    setup({ sku: '' });

    expect(
      screen.getByRole('img', { name: 'Product image unavailable' })
    ).toBeVisible();
    expect(screen.getByText('Jasmine Rice 5kg')).toBeVisible();
    expect(screen.queryByText('RICE-5KG')).not.toBeInTheDocument();
  });
});
