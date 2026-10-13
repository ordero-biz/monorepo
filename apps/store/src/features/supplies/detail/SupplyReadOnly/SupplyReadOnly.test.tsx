import { screen, within } from '@testing-library/react';
import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import type { SupplyDetails } from '@/lib/domain/supplies/types';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { SupplyReadOnly } from './SupplyReadOnly';

const supply: SupplyDetails = {
  id: 9,
  supplier: { id: 3, name: 'Global Foods', status: 'ACTIVE' },
  warehouse: { id: 4, name: 'Main Warehouse', status: 'ACTIVE' },
  status: SUPPLY_STATUS.COMPLETED,
  supplyNumber: 'SUP-009',
  supplierInvoiceNumber: 'INV-004',
  comment: 'Delivered in full',
  totalQuantity: 22,
  totalPrice: 560,
  version: 2,
  supplyEntries: [
    {
      id: 17,
      productVariant: { id: 11, name: 'Jasmine Rice 5kg', sku: 'RICE-5KG' },
      unitOfMeasurement: {
        id: 2,
        name: 'Bag',
        symbol: 'bag',
        status: 'ACTIVE',
      },
      quantity: 20,
      unitPrice: 28,
      comment: 'Keep dry',
    },
    {
      id: 18,
      productVariant: { id: 12, name: 'Rice sample', sku: null },
      unitOfMeasurement: { id: 3, name: 'Box', symbol: null, status: 'ACTIVE' },
      quantity: 2,
      unitPrice: 0,
      comment: null,
    },
  ],
};

const { setup } = prepareStoreSetup({
  component: SupplyReadOnly,
  props: { supply },
});

describe('SupplyReadOnly', () => {
  it('displays the completed supply and every persisted entry without editing controls', () => {
    setup();

    expect(screen.getByText('Completed')).toBeVisible();
    expect(screen.getByText('Global Foods')).toBeVisible();
    expect(screen.getByText('Main Warehouse')).toBeVisible();
    expect(screen.getByText('INV-004')).toBeVisible();
    expect(screen.getByText('Delivered in full')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Supplies' })).toHaveAttribute(
      'href',
      '/products/supplies'
    );

    const table = screen.getByRole('table', { name: 'Supply entries' });
    expect(within(table).getAllByRole('row')).toHaveLength(3);
    const rice = within(table).getByRole('row', { name: /Jasmine Rice 5kg/ });
    expect(within(rice).getByText('RICE-5KG')).toBeVisible();
    expect(within(rice).getByText('Bag (bag)')).toBeVisible();
    expect(within(rice).getByText('20')).toBeVisible();
    expect(within(rice).getByText('$28.00')).toBeVisible();
    expect(within(rice).getByText('$560.00')).toBeVisible();
    expect(within(rice).getByText('Keep dry')).toBeVisible();
    const sample = within(table).getByRole('row', { name: /Rice sample/ });
    expect(within(sample).getByText('Box')).toBeVisible();
    expect(within(sample).getAllByText('$0.00')).toHaveLength(2);
    expect(within(sample).getByText('-')).toBeVisible();
    expect(
      screen.getByText('Total quantity: 22 · Total: $560.00')
    ).toBeVisible();

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', {
        name: /Save draft|Finalize supply|Delete/,
      })
    ).not.toBeInTheDocument();
  });

  it('displays empty entries and missing optional values without adding a placeholder row', () => {
    setup({
      supply: {
        ...supply,
        supplyNumber: null,
        supplierInvoiceNumber: null,
        comment: null,
        supplyEntries: [],
        totalQuantity: 0,
        totalPrice: 0,
      },
    });

    expect(screen.getByText('No products in this supply.')).toBeVisible();
    expect(screen.getAllByText('-')).toHaveLength(3);
    expect(screen.getByText('Total quantity: 0 · Total: $0.00')).toBeVisible();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });
});
