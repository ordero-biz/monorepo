import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UpdateUnitOfMeasurementDialogTrigger } from '@/features/units-of-measurement/detail/UpdateUnitOfMeasurement';
import { updateUnitOfMeasurement } from '@/lib/client/api/units-of-measurement';
import { getWarehouseStock } from '@/lib/client/api/warehouses';
import type { WarehouseStockItem } from '@/lib/domain/warehouses/types';
import { warehousesQueryKeys } from '@/lib/query/warehouses/warehousesQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import type { WarehouseDetailProductsProps } from './types';
import { WarehouseDetailProducts } from './WarehouseDetailProducts';

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  searchParams: new URLSearchParams(),
}));

vi.mock('next/navigation', async () => ({
  ...(await vi.importActual<typeof import('next/navigation')>(
    'next/navigation'
  )),
  usePathname: () => '/warehouse/1',
  useRouter: () => ({ push: mocks.push, replace: mocks.replace }),
  useSearchParams: () => mocks.searchParams,
}));

vi.mock('@/lib/client/api/warehouses', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/warehouses')>(
    '@/lib/client/api/warehouses'
  )),
  getWarehouseStock: vi.fn(),
}));

vi.mock('@/lib/client/api/units-of-measurement', async () => ({
  ...(await vi.importActual<
    typeof import('@/lib/client/api/units-of-measurement')
  >('@/lib/client/api/units-of-measurement')),
  updateUnitOfMeasurement: vi.fn(),
}));

const getWarehouseStockMock = vi.mocked(getWarehouseStock);
const updateUnitOfMeasurementMock = vi.mocked(updateUnitOfMeasurement);
const stockItem: WarehouseStockItem = {
  productVariant: {
    id: 7,
    name: 'Blue shirt',
    sku: 'SHIRT-BL',
    barcode: '123456',
  },
  unitOfMeasurement: { id: 2, name: 'Piece', symbol: 'pc', status: 'ACTIVE' },
  quantity: 3,
  totalPrice: 45.5,
};
const stock = {
  content: [stockItem],
  page: { number: 0, size: 10, totalElements: 21, totalPages: 3 },
};
const { setup } = prepareStoreSetup<WarehouseDetailProductsProps>({
  component: WarehouseDetailProducts,
  props: { warehouseId: '1', paginationInput: { page: 1, size: 10 } },
});

const WarehouseStockUnitEditor = () => (
  <>
    <WarehouseDetailProducts warehouseId="1" />
    <UpdateUnitOfMeasurementDialogTrigger
      unitOfMeasurement={stockItem.unitOfMeasurement}
    />
  </>
);

const { setup: setupUnitEditor } = prepareStoreSetup({
  component: WarehouseStockUnitEditor,
});

describe('WarehouseDetailProducts', () => {
  beforeEach(() => {
    getWarehouseStockMock.mockReset();
    updateUnitOfMeasurementMock.mockReset();
    mocks.push.mockReset();
    mocks.replace.mockReset();
    mocks.searchParams = new URLSearchParams();
    getWarehouseStockMock.mockResolvedValue({ ok: true, data: stock });
  });

  it('refreshes stock once after editing a unit and invalidates cached pages across warehouses', async () => {
    const updatedUnit = { ...stockItem.unitOfMeasurement, symbol: 'piece' };
    updateUnitOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: updatedUnit,
    });
    const user = userEvent.setup();
    const { queryClient } = setupUnitEditor();
    const cachedStockKeys = [
      warehousesQueryKeys.stockPage(1, { page: 2, size: 10 }),
      warehousesQueryKeys.stockPage(2, { page: 1, size: 25 }),
    ];
    for (const queryKey of cachedStockKeys) {
      queryClient.setQueryData(queryKey, stock);
    }
    const warehouseDetailKey = warehousesQueryKeys.detail(1);
    queryClient.setQueryData(warehouseDetailKey, { id: 1 });

    const table = await screen.findByRole('table', {
      name: 'Warehouse products',
    });
    expect(within(table).getByText('Piece (pc)')).toBeVisible();
    getWarehouseStockMock.mockResolvedValue({
      ok: true,
      data: {
        ...stock,
        content: [{ ...stockItem, unitOfMeasurement: updatedUnit }],
      },
    });

    await user.click(screen.getByRole('button', { name: 'Edit Piece' }));
    const symbol = screen.getByRole('textbox', { name: 'Symbol' });
    await user.clear(symbol);
    await user.type(symbol, 'piece');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await within(table).findByText('Piece (piece)')).toBeVisible();
    expect(getWarehouseStockMock).toHaveBeenCalledTimes(2);
    expect(updateUnitOfMeasurementMock).toHaveBeenCalledExactlyOnceWith({
      unitOfMeasurementId: stockItem.unitOfMeasurement.id,
      symbol: 'piece',
    });
    for (const queryKey of cachedStockKeys) {
      expect(queryClient.getQueryState(queryKey)?.isInvalidated).toBe(true);
    }
    expect(queryClient.getQueryState(warehouseDetailKey)?.isInvalidated).toBe(
      false
    );
  });

  it('keeps stock unchanged when a unit edit fails', async () => {
    updateUnitOfMeasurementMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Invalid symbol.',
        fieldErrors: { symbol: 'Invalid symbol.' },
      },
    });
    const user = userEvent.setup();
    const { queryClient } = setupUnitEditor();
    const cachedStockKey = warehousesQueryKeys.stockPage(2, {
      page: 1,
      size: 10,
    });
    queryClient.setQueryData(cachedStockKey, stock);
    const table = await screen.findByRole('table', {
      name: 'Warehouse products',
    });

    await user.click(screen.getByRole('button', { name: 'Edit Piece' }));
    const symbol = screen.getByRole('textbox', { name: 'Symbol' });
    await user.clear(symbol);
    await user.type(symbol, 'invalid');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() =>
      expect(symbol).toHaveAccessibleDescription('Invalid symbol.')
    );
    expect(within(table).getByText('Piece (pc)')).toBeVisible();
    expect(getWarehouseStockMock).toHaveBeenCalledTimes(1);
    expect(queryClient.getQueryState(cachedStockKey)?.isInvalidated).toBe(
      false
    );
  });

  it('shows loading while stock is pending', () => {
    getWarehouseStockMock.mockReturnValue(new Promise(() => {}));
    setup();
    expect(screen.getByText('Loading warehouse products...')).toBeVisible();
  });

  it('renders product details and the server stock totals', async () => {
    setup();
    const table = await screen.findByRole('table', {
      name: 'Warehouse products',
    });
    for (const value of [
      'Blue shirt',
      'SHIRT-BL',
      '123456',
      'Piece (pc)',
      '3',
      '$45.50',
    ]) {
      expect(within(table).getByText(value)).toBeVisible();
    }
    expect(screen.getByText('1-10 of 21')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Products' })).toBeVisible();
    expect(screen.getByText('21', { exact: true })).toBeVisible();
    expect(
      within(table).getByRole('columnheader', { name: 'Stock value' })
    ).toBeVisible();
    expect(getWarehouseStockMock).toHaveBeenCalledWith('1', {
      page: 1,
      size: 10,
    });
  });

  it('renders zero stock, empty product identifiers, and a missing unit symbol', async () => {
    getWarehouseStockMock.mockResolvedValue({
      ok: true,
      data: {
        ...stock,
        content: [
          {
            ...stockItem,
            productVariant: {
              id: 7,
              name: 'Blue shirt',
              sku: '',
              barcode: '',
            },
            unitOfMeasurement: { id: 2, name: 'Piece', status: 'ACTIVE' },
            quantity: 0,
            totalPrice: 0,
          },
        ],
      },
    });
    setup();
    const table = await screen.findByRole('table', {
      name: 'Warehouse products',
    });
    for (const value of ['Blue shirt', '-', 'Piece', '0', '$0.00']) {
      expect(within(table).getByText(value)).toBeVisible();
    }
  });

  it('renders an empty stock page', async () => {
    getWarehouseStockMock.mockResolvedValue({
      ok: true,
      data: {
        content: [],
        page: { number: 0, size: 10, totalElements: 0, totalPages: 0 },
      },
    });
    setup();
    expect(
      await screen.findByText('No products found in this warehouse.')
    ).toBeVisible();
  });

  it('retries a failed stock request', async () => {
    getWarehouseStockMock.mockResolvedValueOnce({
      ok: false,
      error: { status: 503, message: 'Temporarily unavailable.' },
    });
    const user = userEvent.setup();
    setup();
    expect(
      await screen.findByText(
        "We couldn't load this warehouse's products right now."
      )
    ).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(await screen.findByText('Blue shirt')).toBeVisible();
    expect(getWarehouseStockMock).toHaveBeenCalledTimes(2);
  });

  it('renders the requested server page without slicing it again', async () => {
    getWarehouseStockMock.mockResolvedValue({
      ok: true,
      data: {
        ...stock,
        page: { number: 1, size: 10, totalElements: 21, totalPages: 3 },
      },
    });
    const { paginationInput } = setup({
      paginationInput: { page: 2, size: 10 },
    });
    expect(await screen.findByText('Blue shirt')).toBeVisible();
    expect(screen.getByText('11-20 of 21')).toBeVisible();
    expect(getWarehouseStockMock).toHaveBeenCalledWith('1', paginationInput);
  });

  it('replaces the URL with the last available page when the requested page is out of range', async () => {
    mocks.searchParams = new URLSearchParams(
      'page=2&size=10&sort=quantity%2Cdesc'
    );
    getWarehouseStockMock.mockResolvedValue({
      ok: true,
      data: {
        content: [],
        page: { number: 1, size: 10, totalElements: 1, totalPages: 1 },
      },
    });
    const { paginationInput } = setup({
      paginationInput: { page: 2, size: 10, sort: ['quantity,desc'] },
    });

    await waitFor(() => {
      expect(mocks.replace).toHaveBeenCalledExactlyOnceWith(
        '/warehouse/1?page=1&size=10&sort=quantity%2Cdesc',
        { scroll: false }
      );
    });
    expect(getWarehouseStockMock).toHaveBeenCalledExactlyOnceWith(
      '1',
      paginationInput
    );
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it('preserves query parameters when navigating to the next stock page', async () => {
    mocks.searchParams = new URLSearchParams(
      'page=1&size=10&sort=quantity%2Cdesc'
    );
    const user = userEvent.setup();
    setup({ paginationInput: { page: 1, size: 10, sort: ['quantity,desc'] } });
    await user.click(
      await screen.findByRole('button', { name: 'Go to next page' })
    );
    expect(mocks.push).toHaveBeenCalledWith(
      '/warehouse/1?page=2&size=10&sort=quantity%2Cdesc',
      { scroll: false }
    );
  });
});
