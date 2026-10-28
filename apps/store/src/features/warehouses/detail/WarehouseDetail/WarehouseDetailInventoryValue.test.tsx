import { screen, within } from '@testing-library/react';
import { prepareStoreSetup } from '@/test/prepareSetup';
import type { WarehouseDetailInventoryValueProps } from './types';
import { WarehouseDetailInventoryValue } from './WarehouseDetailInventoryValue';

const { setup } = prepareStoreSetup<WarehouseDetailInventoryValueProps>({
  component: WarehouseDetailInventoryValue,
  props: { totalPrice: 4285 },
});

describe('WarehouseDetailInventoryValue', () => {
  it('shows the formatted inventory value, currency, valuation basis, and warehouse scope', () => {
    setup();

    const summary = screen.getByRole('region', { name: 'Inventory value' });

    expect(within(summary).getByText('Inventory value')).toBeVisible();
    expect(within(summary).getByText('$4,285.00')).toBeVisible();
    expect(within(summary).getByText('USD')).toBeVisible();
    expect(
      within(summary).getByText('At cost · All products in this warehouse')
    ).toBeVisible();
  });

  it.each([
    { totalPrice: 0, amount: '$0.00' },
    { totalPrice: 12.5, amount: '$12.50' },
  ])('displays $amount for an inventory value of $totalPrice', ({
    totalPrice,
    amount,
  }) => {
    setup({ totalPrice });

    expect(screen.getByText(amount)).toBeVisible();
    expect(screen.getByText('USD')).toBeVisible();
  });
});
