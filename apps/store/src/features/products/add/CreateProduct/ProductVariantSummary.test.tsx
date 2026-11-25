import { screen, within } from '@testing-library/react';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { ProductVariantSummary } from './ProductVariantSummary';

const { setup } = prepareStoreSetup({
  component: ProductVariantSummary,
  props: { variantCount: 4, hasAttributes: true },
});

describe('Variant summary', () => {
  it('explains the count, product relationship, and next-step tasks', () => {
    setup();
    const sidebar = within(
      screen.getByRole('complementary', { name: 'Variant summary' })
    );
    expect(sidebar.getByText('4 variants')).toBeVisible();
    expect(
      sidebar.getByText('All variants belong to one product')
    ).toBeVisible();
    expect(sidebar.getByText('Review generated variants')).toBeVisible();
    expect(sidebar.getByText('Add SKUs and barcodes')).toBeVisible();
    expect(sidebar.getByText('Set variant statuses')).toBeVisible();
  });

  it('shows zero variants and asks for values when attributes have been added', () => {
    setup({ variantCount: 0 });
    expect(
      screen.getByText('Select attribute values to generate variants')
    ).toBeVisible();
    expect(screen.getByText('0 variants')).toBeVisible();
  });

  it('shows zero variants and explains how to start when no attributes have been added', () => {
    setup({ variantCount: 0, hasAttributes: false });
    expect(screen.getByText('0 variants')).toBeVisible();
    expect(
      screen.getByText(
        'Add an attribute and select its values to generate variants'
      )
    ).toBeVisible();
  });

  it('uses singular wording for one variant', () => {
    setup({ variantCount: 1 });
    expect(screen.getByText('1 variant')).toBeVisible();
  });

  it('explains when selections exceed the supported variant limit', () => {
    setup({ variantCount: 501 });
    expect(screen.getByText('More than 500 variants')).toBeVisible();
    expect(
      screen.getByText(
        'Select fewer values. You can create up to 500 variants.'
      )
    ).toBeVisible();
  });
});
