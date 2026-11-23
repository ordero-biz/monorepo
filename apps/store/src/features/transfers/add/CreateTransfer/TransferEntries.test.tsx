import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createTransfer } from '@/lib/client/api/transfers';
import {
  getWarehouse,
  getWarehouseStock,
  getWarehouses,
} from '@/lib/client/api/warehouses';
import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import type { TransferDetails } from '@/lib/domain/transfers/types';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { transfersQueryKeys } from '@/lib/query/transfers/transfersQueryKeys';
import { warehousesQueryKeys } from '@/lib/query/warehouses/warehousesQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateTransfer } from './CreateTransfer';
import type { CreateTransferProps } from './types';

const mocks = vi.hoisted(() => ({ replace: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mocks.replace }),
}));

vi.mock('@/lib/client/api/warehouses', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/warehouses')>(
    '@/lib/client/api/warehouses'
  )),
  getWarehouse: vi.fn(),
  getWarehouses: vi.fn(),
  getWarehouseStock: vi.fn(),
}));

vi.mock('@/lib/client/api/transfers', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/transfers')>(
    '@/lib/client/api/transfers'
  )),
  createTransfer: vi.fn(),
}));

const getWarehouseMock = vi.mocked(getWarehouse);
const getWarehousesMock = vi.mocked(getWarehouses);
const getWarehouseStockMock = vi.mocked(getWarehouseStock);
const createTransferMock = vi.mocked(createTransfer);

const createWarehouse = (id: number, name: string) => ({
  id,
  name,
  address: '14 Holovna St',
  comment: '',
  phone: null,
  status: WAREHOUSE_STATUS.ACTIVE,
  totalItemQuantity: 0,
  totalPrice: 0,
});

const mainWarehouse = createWarehouse(1, 'Main Warehouse');
const eastWarehouse = createWarehouse(2, 'East Warehouse');
const northWarehouse = createWarehouse(3, 'North Hub');

const bag = { id: 4, name: 'Bag', status: 'ACTIVE' as const, symbol: 'bag' };

const stockItem = (
  id: number,
  name: string,
  sku: string,
  quantity: number
) => ({
  productVariant: { id, name, sku, barcode: '' },
  unitOfMeasurement: bag,
  quantity,
  totalPrice: 0,
});

const stockByWarehouse: Record<number, ReturnType<typeof stockItem>[]> = {
  [mainWarehouse.id]: [
    stockItem(11, 'Jasmine Rice 5kg', 'GR-1042', 120),
    stockItem(12, 'Sunflower Oil 1L', 'OL-0318', 80),
    stockItem(13, 'Sold Out Flour', 'GR-2207', 0),
  ],
  [northWarehouse.id]: [stockItem(21, 'Penne Pasta 500g', 'GR-3110', 40)],
};

const createdTransfer = (
  status: TransferDetails['status']
): TransferDetails => ({
  id: 5,
  sourceWarehouse: { id: 1, name: 'Main Warehouse', status: 'ACTIVE' },
  destinationWarehouse: { id: 2, name: 'East Warehouse', status: 'ACTIVE' },
  transferNumber: 'Weekend restock',
  status,
  comment: null,
  dispatchedAt: null,
  dispatchedBy: null,
  completedAt: null,
  completedBy: null,
  createdAt: '2026-11-16T10:00:00Z',
  createdBy: 'owner@example.test',
  updatedAt: '2026-11-16T10:00:00Z',
  updatedBy: 'owner@example.test',
  transferEntries: [],
  version: 1,
});

const { setup } = prepareStoreSetup<CreateTransferProps>({
  component: CreateTransfer,
});

type User = ReturnType<typeof userEvent.setup>;

const pickOption = async (user: User, combobox: HTMLElement, name: RegExp) => {
  await user.click(combobox);
  await user.click(await screen.findByRole('option', { name }));
};

const getProduct = (row: number) =>
  screen.getByRole('combobox', { name: `Product for row ${row}` });
const getQuantity = (row: number) =>
  screen.getByRole('textbox', { name: `Quantity for row ${row}` });

const openWithMainWarehouse = async () => {
  const result = setup({ sourceWarehouseId: mainWarehouse.id });
  await screen.findByRole('form', { name: 'Transfer' });
  return result;
};

const fillTransferInformation = async (user: User) => {
  await user.type(
    screen.getByRole('textbox', { name: /Name/ }),
    ' Weekend restock '
  );
  await pickOption(
    user,
    screen.getByRole('combobox', { name: /To warehouse/ }),
    /East Warehouse/
  );
};

describe('TransferEntries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getWarehouseMock.mockResolvedValue({ ok: true, data: mainWarehouse });
    getWarehousesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [mainWarehouse, eastWarehouse, northWarehouse],
        page: { number: 0, size: 100, totalElements: 3, totalPages: 1 },
      },
    });
    getWarehouseStockMock.mockImplementation(async (warehouseId) => {
      const content = stockByWarehouse[Number(warehouseId)] ?? [];
      return {
        ok: true,
        data: {
          content,
          page: {
            number: 0,
            size: 100,
            totalElements: content.length,
            totalPages: 1,
          },
        },
      };
    });
  });

  it('asks for a source warehouse before products can be picked', async () => {
    setup();

    expect(getProduct(1)).toBeDisabled();
    expect(getProduct(1)).toHaveAttribute(
      'placeholder',
      'Select a source warehouse first'
    );
    expect(getWarehouseStockMock).not.toHaveBeenCalled();
  });

  it('lists source stock and fills the unit and available quantity', async () => {
    const user = userEvent.setup();
    await openWithMainWarehouse();

    await user.click(getProduct(1));
    expect(
      await screen.findByRole('option', { name: /Jasmine Rice 5kg/ })
    ).toHaveTextContent('Jasmine Rice 5kg · GR-1042, 120 Bag (bag) in stock');
    expect(
      screen.queryByRole('option', { name: /Sold Out Flour/ })
    ).not.toBeInTheDocument();
    expect(getWarehouseStockMock).toHaveBeenCalledWith(mainWarehouse.id, {
      page: 1,
      size: 100,
    });

    await user.click(screen.getByRole('option', { name: /Jasmine Rice 5kg/ }));
    const row = getProduct(1).closest('tr') as HTMLElement;
    expect(within(row).getByText('Bag (bag)')).toBeVisible();
    expect(within(row).getByText('120')).toBeVisible();
  });

  it('rejects quantities above the available stock', async () => {
    const user = userEvent.setup();
    await openWithMainWarehouse();
    await pickOption(user, getProduct(1), /Jasmine Rice 5kg/);

    await user.type(getQuantity(1), '121');
    await user.tab();
    expect(getQuantity(1)).toHaveAccessibleDescription('Only 120 available');

    await user.clear(getQuantity(1));
    await user.type(getQuantity(1), '120');
    expect(screen.queryByText('Only 120 available')).not.toBeInTheDocument();
  });

  it('disables stock lines that are already in the transfer', async () => {
    const user = userEvent.setup();
    await openWithMainWarehouse();
    await pickOption(user, getProduct(1), /Jasmine Rice 5kg/);

    await user.click(
      screen.getByRole('button', { name: '+ Add another product' })
    );
    await user.click(getProduct(2));

    expect(
      await screen.findByRole('option', { name: /Jasmine Rice 5kg/ })
    ).toHaveAttribute('aria-disabled', 'true');
    expect(
      screen.getByRole('option', { name: /Sunflower Oil 1L/ })
    ).not.toHaveAttribute('aria-disabled', 'true');
  });

  it('confirms before a source change removes picked products', async () => {
    const user = userEvent.setup();
    await openWithMainWarehouse();
    await pickOption(user, getProduct(1), /Jasmine Rice 5kg/);
    const source = screen.getByRole('combobox', { name: /From warehouse/ });

    await pickOption(user, source, /North Hub/);
    const dialog = await screen.findByRole('dialog', {
      name: 'Change source warehouse?',
    });
    expect(dialog).toHaveTextContent(
      'Switching to North Hub will remove the products from this transfer.'
    );
    expect(source).toHaveValue('Main Warehouse');

    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    expect(
      screen.queryByRole('dialog', { name: 'Change source warehouse?' })
    ).not.toBeInTheDocument();
    expect(source).toHaveValue('Main Warehouse');
    expect(getProduct(1)).toHaveValue('Jasmine Rice 5kg · GR-1042');
    await waitFor(() => expect(source).toHaveFocus());

    await pickOption(user, source, /North Hub/);
    await user.click(
      await screen.findByRole('button', { name: 'Change and remove products' })
    );
    expect(source).toHaveValue('North Hub');
    expect(getProduct(1)).toHaveValue('');

    await pickOption(user, getProduct(1), /Penne Pasta 500g/);
    expect(getWarehouseStockMock).toHaveBeenLastCalledWith(
      northWarehouse.id,
      expect.anything()
    );
  });

  it('switches the source right away when no products are picked', async () => {
    const user = userEvent.setup();
    await openWithMainWarehouse();
    const source = screen.getByRole('combobox', { name: /From warehouse/ });

    await pickOption(user, source, /North Hub/);

    expect(source).toHaveValue('North Hub');
    expect(
      screen.queryByRole('dialog', { name: 'Change source warehouse?' })
    ).not.toBeInTheDocument();
  });

  it('fills the quantity with all available stock from the input action', async () => {
    const user = userEvent.setup();
    await openWithMainWarehouse();

    expect(
      screen.queryByRole('button', { name: 'Use all available for row 1' })
    ).not.toBeInTheDocument();

    await pickOption(user, getProduct(1), /Jasmine Rice 5kg/);
    await user.type(getQuantity(1), '5');
    const useAll = screen.getByRole('button', {
      name: 'Use all available for row 1',
    });
    await user.click(useAll);

    expect(getQuantity(1)).toHaveValue('120');
    expect(useAll).toBeDisabled();
    expect(screen.getByText('1 product · 120 units')).toBeVisible();
  });

  it('keeps selection actions without a bulk quantity fill', async () => {
    const user = userEvent.setup();
    await openWithMainWarehouse();
    await pickOption(user, getProduct(1), /Jasmine Rice 5kg/);

    await user.click(
      screen.getByRole('checkbox', { name: 'Select all transfer entries' })
    );

    expect(screen.getByText('1 selected')).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Move all available' })
    ).not.toBeInTheDocument();
  });

  it('deletes the selected rows and keeps one empty row', async () => {
    const user = userEvent.setup();
    await openWithMainWarehouse();
    await pickOption(user, getProduct(1), /Jasmine Rice 5kg/);

    await user.click(
      screen.getByRole('checkbox', { name: 'Select Jasmine Rice 5kg' })
    );
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(getProduct(1)).toHaveValue('');
    expect(
      screen.queryByRole('combobox', { name: 'Product for row 2' })
    ).not.toBeInTheDocument();
  });

  it('saves a draft and returns to the source warehouse', async () => {
    const user = userEvent.setup();
    createTransferMock.mockResolvedValue({
      ok: true,
      data: createdTransfer(TRANSFER_STATUS.DRAFT),
    });
    const { queryClient } = await openWithMainWarehouse();
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
    await fillTransferInformation(user);
    await pickOption(user, getProduct(1), /Jasmine Rice 5kg/);
    await user.type(getQuantity(1), '20');
    await user.type(
      screen.getByRole('textbox', { name: 'Comment for row 1' }),
      ' Fragile '
    );
    await user.click(
      screen.getByRole('button', { name: '+ Add another product' })
    );

    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    await waitFor(() =>
      expect(mocks.replace).toHaveBeenCalledWith('/warehouse/1')
    );
    expect(createTransferMock).toHaveBeenCalledWith({
      sourceWarehouseId: 1,
      destinationWarehouseId: 2,
      transferNumber: 'Weekend restock',
      status: TRANSFER_STATUS.DRAFT,
      transferEntries: [
        {
          productVariantId: 11,
          unitOfMeasurementId: 4,
          quantity: 20,
          comment: 'Fragile',
        },
      ],
    });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: transfersQueryKeys.list,
    });
    expect(invalidateQueries).not.toHaveBeenCalledWith({
      queryKey: warehousesQueryKeys.stock(mainWarehouse.id),
    });
    expect(await screen.findByText('Transfer draft created.')).toBeVisible();
  });

  it('starts a transfer after confirmation and refreshes both warehouses', async () => {
    const user = userEvent.setup();
    createTransferMock.mockResolvedValue({
      ok: true,
      data: createdTransfer(TRANSFER_STATUS.IN_TRANSIT),
    });
    const { queryClient } = await openWithMainWarehouse();
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
    await fillTransferInformation(user);
    await pickOption(user, getProduct(1), /Jasmine Rice 5kg/);
    await user.type(getQuantity(1), '20');

    await user.click(screen.getByRole('button', { name: 'Transfer' }));
    const dialog = await screen.findByRole('dialog', {
      name: 'Start transfer',
    });
    expect(dialog).toHaveTextContent(
      'The transfer will be marked as "In transit". Its products will be unavailable for stock operations until the transfer is completed.'
    );
    await user.click(
      within(dialog).getByRole('button', { name: 'Start transfer' })
    );

    await waitFor(() =>
      expect(mocks.replace).toHaveBeenCalledWith('/warehouse/1')
    );
    expect(createTransferMock).toHaveBeenCalledWith(
      expect.objectContaining({ status: TRANSFER_STATUS.IN_TRANSIT })
    );
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: transfersQueryKeys.list,
    });
    for (const warehouseId of [mainWarehouse.id, eastWarehouse.id]) {
      expect(invalidateQueries).toHaveBeenCalledWith({
        queryKey: warehousesQueryKeys.stock(warehouseId),
      });
      expect(invalidateQueries).toHaveBeenCalledWith({
        queryKey: warehousesQueryKeys.detail(warehouseId),
      });
    }
  });

  it('requires at least one product after confirming a transfer', async () => {
    const user = userEvent.setup();
    await openWithMainWarehouse();
    await fillTransferInformation(user);

    await user.click(screen.getByRole('button', { name: 'Transfer' }));
    await user.click(
      await screen.findByRole('button', { name: 'Start transfer' })
    );

    expect(
      await screen.findByText('Add at least one product before transferring.')
    ).toBeVisible();
    expect(
      screen.queryByRole('dialog', { name: 'Start transfer' })
    ).not.toBeInTheDocument();
    expect(createTransferMock).not.toHaveBeenCalled();
  });

  it('shows required field errors after confirming a transfer', async () => {
    const user = userEvent.setup();
    await openWithMainWarehouse();
    await pickOption(user, getProduct(1), /Jasmine Rice 5kg/);
    await user.type(getQuantity(1), '20');

    await user.click(screen.getByRole('button', { name: 'Transfer' }));
    await user.click(
      await screen.findByRole('button', { name: 'Start transfer' })
    );

    expect(await screen.findByText('Name is required')).toBeVisible();
    expect(screen.getByText('Select a destination warehouse')).toBeVisible();
    expect(
      screen.queryByRole('dialog', { name: 'Start transfer' })
    ).not.toBeInTheDocument();
    expect(createTransferMock).not.toHaveBeenCalled();
  });

  it('shows row errors returned by the backend on the submitted row', async () => {
    const user = userEvent.setup();
    createTransferMock.mockResolvedValue({
      ok: false,
      error: {
        status: 400,
        message: 'Validation failed.',
        fieldErrors: {
          'transferEntries.0.quantity': 'Not enough stock',
          destinationWarehouseId: 'Warehouse is archived',
        },
      },
    });
    await openWithMainWarehouse();
    await fillTransferInformation(user);
    await pickOption(user, getProduct(1), /Jasmine Rice 5kg/);
    await user.type(getQuantity(1), '20');

    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    await waitFor(() =>
      expect(getQuantity(1)).toHaveAccessibleDescription('Not enough stock')
    );
    expect(screen.getByText('Warehouse is archived')).toBeVisible();
    expect(mocks.replace).not.toHaveBeenCalled();
  });
});
