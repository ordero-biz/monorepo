import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getWarehouseStock } from '@/lib/client/api/warehouses';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { SourceStockAsyncCombobox } from './SourceStockAsyncCombobox';
import type { SourceStockAsyncComboboxProps } from './types';

vi.mock('@/lib/client/api/warehouses', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/warehouses')>(
    '@/lib/client/api/warehouses'
  )),
  getWarehouseStock: vi.fn(),
}));

const getWarehouseStockMock = vi.mocked(getWarehouseStock);

const bag = { id: 4, name: 'Bag', status: 'ACTIVE' as const, symbol: 'bag' };

const stockItem = (id: number, name: string, quantity: number) => ({
  productVariant: { id, name, sku: `SKU-${id}`, barcode: '' },
  unitOfMeasurement: bag,
  quantity,
  totalPrice: 0,
});

const { setup } = prepareStoreSetup<SourceStockAsyncComboboxProps>({
  component: SourceStockAsyncCombobox,
  props: {
    'aria-label': 'Product',
    placeholder: 'Select product',
    warehouseId: 1,
  },
});

describe('SourceStockAsyncCombobox', () => {
  beforeEach(() => {
    getWarehouseStockMock.mockReset();
  });

  it('is disabled and loads nothing without a source warehouse', () => {
    setup({ warehouseId: null });

    expect(screen.getByRole('combobox', { name: 'Product' })).toBeDisabled();
    expect(getWarehouseStockMock).not.toHaveBeenCalled();
  });

  it('lists only stock lines with a positive quantity', async () => {
    getWarehouseStockMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          stockItem(11, 'Jasmine Rice 5kg', 120),
          stockItem(12, 'Sold Out Flour', 0),
        ],
        page: { number: 0, size: 100, totalElements: 2, totalPages: 1 },
      },
    });
    const user = userEvent.setup();

    setup();
    await user.click(screen.getByRole('combobox', { name: 'Product' }));

    const option = await screen.findByRole('option', {
      name: /Jasmine Rice 5kg/,
    });
    expect(option).toHaveTextContent('120 Bag (bag) in stock');
    expect(
      screen.queryByRole('option', { name: /Sold Out Flour/ })
    ).not.toBeInTheDocument();
    expect(getWarehouseStockMock).toHaveBeenCalledWith(1, {
      page: 1,
      size: 100,
    });
  });

  it('shows the empty state when the warehouse has no stock', async () => {
    getWarehouseStockMock.mockResolvedValue({
      ok: true,
      data: {
        content: [],
        page: { number: 0, size: 100, totalElements: 0, totalPages: 0 },
      },
    });
    const user = userEvent.setup();

    setup();
    await user.click(screen.getByRole('combobox', { name: 'Product' }));

    expect(await screen.findByText('No products in stock')).toBeVisible();
  });
});
