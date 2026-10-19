import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getProductVariants } from '@/lib/client/api/products';
import { getSuppliers } from '@/lib/client/api/suppliers';
import { updateSupply } from '@/lib/client/api/supplies';
import { getUnitsOfMeasurement } from '@/lib/client/api/units-of-measurement';
import { getWarehouses } from '@/lib/client/api/warehouses';
import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import type { SupplyDetails } from '@/lib/domain/supplies/types';
import { suppliesQueryKeys } from '@/lib/query/supplies/suppliesQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { UpdateSupply } from './UpdateSupply';

vi.mock('@/lib/client/api/supplies', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/supplies')>(
    '@/lib/client/api/supplies'
  )),
  updateSupply: vi.fn(),
}));

vi.mock('@/lib/client/api/suppliers', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/suppliers')>(
    '@/lib/client/api/suppliers'
  )),
  getSuppliers: vi.fn(),
}));
const getSuppliersMock = vi.mocked(getSuppliers);

vi.mock('@/lib/client/api/warehouses', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/warehouses')>(
    '@/lib/client/api/warehouses'
  )),
  getWarehouses: vi.fn(),
}));
const getWarehousesMock = vi.mocked(getWarehouses);

vi.mock('@/lib/client/api/products', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/products')>(
    '@/lib/client/api/products'
  )),
  getProductVariants: vi.fn(),
}));
const getProductVariantsMock = vi.mocked(getProductVariants);

vi.mock('@/lib/client/api/units-of-measurement', async () => ({
  ...(await vi.importActual<
    typeof import('@/lib/client/api/units-of-measurement')
  >('@/lib/client/api/units-of-measurement')),
  getUnitsOfMeasurement: vi.fn(),
}));
const getUnitsOfMeasurementMock = vi.mocked(getUnitsOfMeasurement);

const updateSupplyMock = vi.mocked(updateSupply);
const savedSupply: SupplyDetails = {
  id: 9,
  supplier: { id: 3, name: 'Global Foods', status: 'ACTIVE' },
  warehouse: { id: 4, name: 'Main Warehouse', status: 'ACTIVE' },
  status: SUPPLY_STATUS.DRAFT,
  supplyNumber: 'SUP-001',
  totalQuantity: 20,
  totalPrice: 560,
  version: 1,
  supplyEntries: [
    {
      id: 17,
      productVariant: { id: 11, name: 'Jasmine Rice 5kg', sku: 'RICE-5KG' },
      unitOfMeasurement: {
        id: 2,
        name: 'Bag',
        status: 'ACTIVE',
        symbol: 'bag',
      },
      quantity: 20,
      unitPrice: 28,
    },
  ],
};

const { setup } = prepareStoreSetup({
  component: UpdateSupply,
  props: { supply: savedSupply },
});

describe('UpdateSupply', () => {
  beforeEach(() => {
    updateSupplyMock.mockReset();
    getSuppliersMock.mockReset();
    getWarehousesMock.mockReset();
    getProductVariantsMock.mockReset();
    getUnitsOfMeasurementMock.mockReset();
  });
  it('restores one clean empty row after deleting the last saved product', async () => {
    const user = userEvent.setup();
    updateSupplyMock.mockResolvedValue({ ok: true, data: savedSupply });
    setup({
      supply: {
        ...savedSupply,
        supplyEntries: [{ ...savedSupply.supplyEntries[0], quantity: 0 }],
      },
    });
    expect(
      screen.queryByRole('combobox', { name: 'Product for row 2' })
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    expect(
      screen.getByRole('spinbutton', { name: 'Quantity for row 1' })
    ).toHaveAccessibleDescription(
      'Quantity must be a whole number greater than 0'
    );

    await user.click(
      screen.getByRole('button', { name: 'Actions for Jasmine Rice 5kg' })
    );
    await user.click(await screen.findByRole('menuitem', { name: 'Delete' }));

    expect(
      screen.getByRole('combobox', { name: 'Product for row 1' })
    ).toHaveValue('');
    expect(
      screen.queryByRole('combobox', { name: 'Product for row 2' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Quantity must be a whole number greater than 0')
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '+ Add another product' })
    ).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    await waitFor(() =>
      expect(updateSupplyMock).toHaveBeenCalledExactlyOnceWith({
        supplyId: savedSupply.id,
        expectedVersion: savedSupply.version,
        supplyEntries: [],
      })
    );
  });

  it('does not move a deleted row error onto the next row', async () => {
    const user = userEvent.setup();
    setup({
      supply: {
        ...savedSupply,
        supplyEntries: [
          { ...savedSupply.supplyEntries[0], quantity: 0 },
          {
            ...savedSupply.supplyEntries[0],
            id: 18,
            productVariant: { id: 12, name: 'Brown Rice', sku: 'BROWN' },
            quantity: 3,
          },
        ],
      },
    });
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    expect(
      screen.getByRole('spinbutton', { name: 'Quantity for row 1' })
    ).toHaveAccessibleDescription(
      'Quantity must be a whole number greater than 0'
    );
    await user.click(
      screen.getByRole('button', { name: 'Actions for Jasmine Rice 5kg' })
    );
    await user.click(await screen.findByRole('menuitem', { name: 'Delete' }));

    await waitFor(() =>
      expect(
        screen.getByRole('combobox', { name: 'Product for row 1' })
      ).toHaveValue('Brown Rice · BROWN')
    );
    expect(
      screen.getByRole('spinbutton', { name: 'Quantity for row 1' })
    ).toHaveValue(3);
    expect(
      screen.getByRole('spinbutton', { name: 'Quantity for row 1' })
    ).not.toHaveAttribute('aria-invalid', 'true');
    expect(
      screen.queryByText('Quantity must be a whole number greater than 0')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('combobox', { name: 'Product for row 2' })
    ).not.toBeInTheDocument();
    expect(updateSupplyMock).not.toHaveBeenCalled();
  });

  it('keeps validation on a surviving invalid row after deleting an earlier row', async () => {
    const user = userEvent.setup();
    setup({
      supply: {
        ...savedSupply,
        supplyEntries: [
          savedSupply.supplyEntries[0],
          {
            ...savedSupply.supplyEntries[0],
            id: 18,
            productVariant: { id: 12, name: 'Brown Rice', sku: 'BROWN' },
            quantity: 0,
          },
        ],
      },
    });
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    expect(
      screen.getByRole('spinbutton', { name: 'Quantity for row 2' })
    ).toHaveAccessibleDescription(
      'Quantity must be a whole number greater than 0'
    );
    await user.click(
      screen.getByRole('button', { name: 'Actions for Jasmine Rice 5kg' })
    );
    await user.click(await screen.findByRole('menuitem', { name: 'Delete' }));
    await waitFor(() =>
      expect(
        screen.getByRole('combobox', { name: 'Product for row 1' })
      ).toHaveValue('Brown Rice · BROWN')
    );
    expect(
      screen.getByRole('spinbutton', { name: 'Quantity for row 1' })
    ).toHaveAccessibleDescription(
      'Quantity must be a whole number greater than 0'
    );
    expect(
      screen.queryByRole('spinbutton', { name: 'Quantity for row 2' })
    ).not.toBeInTheDocument();
  });

  it('deletes nonadjacent selected rows and saves edits to the surviving row', async () => {
    const user = userEvent.setup();
    updateSupplyMock.mockResolvedValue({ ok: true, data: savedSupply });
    setup({
      supply: {
        ...savedSupply,
        supplyEntries: [
          savedSupply.supplyEntries[0],
          {
            ...savedSupply.supplyEntries[0],
            id: 18,
            productVariant: { id: 12, name: 'Brown Rice', sku: 'BROWN' },
            quantity: 3,
          },
          {
            ...savedSupply.supplyEntries[0],
            id: 19,
            productVariant: { id: 13, name: 'Basmati Rice', sku: 'BASMATI' },
            quantity: 5,
          },
        ],
      },
    });
    await user.click(
      screen.getByRole('checkbox', { name: 'Select Jasmine Rice 5kg' })
    );
    await user.click(
      screen.getByRole('checkbox', { name: 'Select Basmati Rice' })
    );
    const bulkActions = screen.getByRole('complementary', {
      name: 'Supply entry bulk actions',
    });
    expect(within(bulkActions).getByText('2 selected')).toBeVisible();
    await user.click(
      within(bulkActions).getByRole('button', { name: 'Delete' })
    );

    await waitFor(() =>
      expect(
        screen.queryByRole('complementary', {
          name: 'Supply entry bulk actions',
        })
      ).not.toBeInTheDocument()
    );
    expect(
      screen.getByRole('combobox', { name: 'Product for row 1' })
    ).toHaveValue('Brown Rice · BROWN');
    expect(
      screen.queryByRole('combobox', { name: 'Product for row 2' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('combobox', { name: 'Product for row 3' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Select Brown Rice' })
    ).not.toBeChecked();
    const quantity = screen.getByRole('spinbutton', {
      name: 'Quantity for row 1',
    });
    await user.clear(quantity);
    await user.type(quantity, '7');
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    expect(updateSupplyMock).toHaveBeenCalledWith({
      supplyId: 9,
      expectedVersion: 1,
      supplyEntries: [
        {
          productVariantId: 12,
          unitOfMeasurementId: 2,
          quantity: 7,
          unitPrice: 28,
          comment: null,
        },
      ],
    });
  });

  it('maps supplierId errors to the object field and submits only its ID after correction', async () => {
    const user = userEvent.setup();
    const nextSupplier = {
      id: 8,
      name: 'New supplier',
      status: 'ACTIVE' as const,
    };
    getSuppliersMock.mockResolvedValue({
      ok: true,
      data: {
        content: [nextSupplier],
        page: { number: 0, size: 100, totalElements: 1, totalPages: 1 },
      },
    });
    updateSupplyMock
      .mockResolvedValueOnce({
        ok: false,
        error: {
          status: 400,
          message: 'Invalid supplier',
          fieldErrors: { supplierId: 'Supplier is unavailable' },
        },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: {
          ...savedSupply,
          supplier: nextSupplier,
          supplyNumber: 'SUP-002',
          version: 2,
        },
      });
    setup();
    const supplier = screen.getByRole('combobox', { name: /Supplier/ });
    expect(supplier).toHaveValue('Global Foods');
    expect(getSuppliersMock).not.toHaveBeenCalled();
    const number = screen.getByRole('textbox', { name: /Supply number/ });
    await user.clear(number);
    await user.type(number, 'SUP-002');
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    expect(await screen.findByText('Supplier is unavailable')).toBeVisible();
    expect(supplier).toHaveAccessibleDescription('Supplier is unavailable');
    await user.click(supplier);
    await user.clear(supplier);
    await user.click(
      await screen.findByRole('option', { name: 'New supplier' })
    );
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    await waitFor(() =>
      expect(updateSupplyMock).toHaveBeenLastCalledWith({
        supplyId: 9,
        expectedVersion: 1,
        supplierId: 8,
        supplyNumber: 'SUP-002',
      })
    );
    await waitFor(() =>
      expect(
        screen.queryByText('Supplier is unavailable')
      ).not.toBeInTheDocument()
    );
  });

  it('maps warehouseId errors to the object field and submits only its ID after correction', async () => {
    const user = userEvent.setup();
    const nextWarehouse = {
      id: 8,
      name: 'New warehouse',
      status: 'ACTIVE' as const,
    };
    getWarehousesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [{ ...nextWarehouse, comment: '' }],
        page: { number: 0, size: 100, totalElements: 1, totalPages: 1 },
      },
    });
    updateSupplyMock
      .mockResolvedValueOnce({
        ok: false,
        error: {
          status: 400,
          message: 'Invalid warehouse',
          fieldErrors: { warehouseId: 'Warehouse is unavailable' },
        },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: {
          ...savedSupply,
          warehouse: nextWarehouse,
          supplyNumber: 'SUP-002',
          version: 2,
        },
      });
    setup();
    const warehouse = screen.getByRole('combobox', { name: /Warehouse/ });
    expect(warehouse).toHaveValue('Main Warehouse');
    expect(getWarehousesMock).not.toHaveBeenCalled();
    const number = screen.getByRole('textbox', { name: /Supply number/ });
    await user.clear(number);
    await user.type(number, 'SUP-002');
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    expect(await screen.findByText('Warehouse is unavailable')).toBeVisible();
    expect(warehouse).toHaveAccessibleDescription('Warehouse is unavailable');
    await user.click(warehouse);
    await user.clear(warehouse);
    await user.click(
      await screen.findByRole('option', { name: 'New warehouse' })
    );
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    await waitFor(() =>
      expect(updateSupplyMock).toHaveBeenLastCalledWith({
        supplyId: 9,
        expectedVersion: 1,
        warehouseId: 8,
        supplyNumber: 'SUP-002',
      })
    );
    await waitFor(() =>
      expect(
        screen.queryByText('Warehouse is unavailable')
      ).not.toBeInTheDocument()
    );
  });

  it.each([
    'supplyEntries.0',
    'supplyEntries[0]',
  ])('maps %s errors to the submitted product after omitting a blank row', async (errorPath) => {
    const user = userEvent.setup();
    const emptyOptions = {
      ok: true as const,
      data: {
        content: [],
        page: { number: 0, size: 100, totalElements: 0, totalPages: 0 },
      },
    };
    getProductVariantsMock.mockResolvedValue(emptyOptions);
    getUnitsOfMeasurementMock.mockResolvedValue(emptyOptions);
    updateSupplyMock.mockResolvedValue({
      ok: false,
      error: {
        status: 400,
        message: 'Invalid supply entries',
        fieldErrors: {
          [`${errorPath}.quantity`]: 'Quantity is unavailable',
          [`${errorPath}.productVariantId`]: 'Product is unavailable',
          [`${errorPath}.unitOfMeasurementId`]: 'Unit is unavailable',
        },
      },
    });
    const { supply } = setup({
      supply: {
        ...savedSupply,
        supplyEntries: [
          savedSupply.supplyEntries[0],
          { ...savedSupply.supplyEntries[0], id: 18 },
        ],
      },
    });

    await user.clear(
      screen.getByRole('combobox', { name: 'Product for row 1' })
    );
    await user.clear(screen.getByRole('combobox', { name: 'Unit for row 1' }));
    await user.clear(
      screen.getByRole('spinbutton', { name: 'Quantity for row 1' })
    );
    await user.clear(
      screen.getByRole('spinbutton', { name: 'Unit price for row 1' })
    );
    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    await waitFor(() =>
      expect(updateSupplyMock).toHaveBeenCalledExactlyOnceWith({
        supplyId: supply?.id,
        expectedVersion: supply?.version,
        supplyEntries: [
          {
            productVariantId: 11,
            unitOfMeasurementId: 2,
            quantity: 20,
            unitPrice: 28,
            comment: null,
          },
        ],
      })
    );
    await waitFor(() =>
      expect(
        screen.getByRole('spinbutton', { name: 'Quantity for row 2' })
      ).toHaveAccessibleDescription('Quantity is unavailable')
    );
    expect(
      screen.getByRole('combobox', { name: 'Product for row 2' })
    ).toHaveAccessibleDescription('Product is unavailable');
    expect(
      screen.getByRole('combobox', { name: 'Unit for row 2' })
    ).toHaveAccessibleDescription('Unit is unavailable');
    expect(
      screen.getByRole('spinbutton', { name: 'Quantity for row 1' })
    ).toHaveAccessibleDescription('');
    expect(
      screen.getByRole('combobox', { name: 'Product for row 1' })
    ).toHaveAccessibleDescription('');
    expect(
      screen.getByRole('combobox', { name: 'Unit for row 1' })
    ).toHaveAccessibleDescription('');
  });

  it('requires a warehouse after clearing the saved selection', async () => {
    const user = userEvent.setup();
    getWarehousesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [],
        page: { number: 0, size: 100, totalElements: 0, totalPages: 0 },
      },
    });
    setup();
    await user.clear(screen.getByRole('combobox', { name: /Warehouse/ }));
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    expect(await screen.findByText('Select a warehouse')).toBeVisible();
    expect(updateSupplyMock).not.toHaveBeenCalled();
  });

  it.each([
    'supplyEntries.0.productVariantId',
    'supplyEntries[0].productVariantId',
  ])('maps %s errors and serializes a replacement without stale SKU metadata', async (errorPath) => {
    const user = userEvent.setup();
    getProductVariantsMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 12,
            name: 'Other rice',
            sku: '',
            description: '',
            barcode: '',
            createdAt: '',
            status: 'ACTIVE',
            productVariantAttributeValues: [],
          },
        ],
        page: { number: 0, size: 100, totalElements: 1, totalPages: 1 },
      },
    });
    updateSupplyMock
      .mockResolvedValueOnce({
        ok: false,
        error: {
          status: 400,
          message: 'Invalid product',
          fieldErrors: { [errorPath]: 'Product is unavailable' },
        },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: { ...savedSupply, version: 2 },
      });
    setup();
    const product = screen.getByRole('combobox', { name: 'Product for row 1' });
    expect(product).toHaveValue('Jasmine Rice 5kg · RICE-5KG');
    expect(getProductVariantsMock).not.toHaveBeenCalled();
    const quantity = screen.getByRole('spinbutton', {
      name: 'Quantity for row 1',
    });
    await user.clear(quantity);
    await user.type(quantity, '25');
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    expect(await screen.findByText('Product is unavailable')).toBeVisible();
    expect(product).toHaveAccessibleDescription('Product is unavailable');
    await user.click(product);
    await user.clear(product);
    await user.click(await screen.findByRole('option', { name: 'Other rice' }));
    expect(
      screen.getByRole('combobox', { name: 'Product for row 1' })
    ).toHaveValue('Other rice');
    expect(
      screen.getByRole('checkbox', { name: 'Select Other rice' })
    ).toBeVisible();
    expect(
      screen.queryByRole('combobox', { name: 'Product for row 3' })
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    await waitFor(() =>
      expect(updateSupplyMock).toHaveBeenLastCalledWith({
        supplyId: 9,
        expectedVersion: 1,
        supplyEntries: [
          {
            productVariantId: 12,
            unitOfMeasurementId: 2,
            quantity: 25,
            unitPrice: 28,
            comment: null,
          },
        ],
      })
    );
    await waitFor(() =>
      expect(
        screen.queryByText('Product is unavailable')
      ).not.toBeInTheDocument()
    );
  });

  it('adds a blank row manually after selecting a product in the last row', async () => {
    const user = userEvent.setup();
    getProductVariantsMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 12,
            name: 'Other rice',
            sku: '',
            description: '',
            barcode: '',
            createdAt: '',
            status: 'ACTIVE',
            productVariantAttributeValues: [],
          },
        ],
        page: { number: 0, size: 100, totalElements: 1, totalPages: 1 },
      },
    });
    setup();
    expect(
      screen.queryByRole('combobox', { name: 'Product for row 2' })
    ).not.toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: '+ Add another product' })
    );
    await user.click(
      screen.getByRole('combobox', { name: 'Product for row 2' })
    );
    await user.click(await screen.findByRole('option', { name: 'Other rice' }));
    expect(
      screen.getByRole('combobox', { name: 'Product for row 2' })
    ).toHaveValue('Other rice');
    expect(
      screen.queryByRole('combobox', { name: 'Product for row 3' })
    ).not.toBeInTheDocument();
    const addProduct = screen.getByRole('button', {
      name: '+ Add another product',
    });
    expect(addProduct).toBeEnabled();
    await user.click(addProduct);
    expect(
      screen.getByRole('combobox', { name: 'Product for row 3' })
    ).toHaveValue('');
    expect(addProduct).toBeDisabled();
    expect(
      screen.queryByRole('combobox', { name: 'Product for row 4' })
    ).not.toBeInTheDocument();
    await user.clear(
      screen.getByRole('combobox', { name: 'Product for row 1' })
    );
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    expect(await screen.findByText('Select a product')).toBeVisible();
    expect(updateSupplyMock).not.toHaveBeenCalled();
  });

  it.each([
    'supplyEntries.0.unitOfMeasurementId',
    'supplyEntries[0].unitOfMeasurementId',
  ])('maps %s errors and serializes a replacement without stale symbol metadata', async (errorPath) => {
    const user = userEvent.setup();
    getUnitsOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: {
        content: [{ id: 3, name: 'Piece', symbol: null, status: 'ACTIVE' }],
        page: { number: 0, size: 100, totalElements: 1, totalPages: 1 },
      },
    });
    updateSupplyMock
      .mockResolvedValueOnce({
        ok: false,
        error: {
          status: 400,
          message: 'Invalid unit',
          fieldErrors: { [errorPath]: 'Unit is unavailable' },
        },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: { ...savedSupply, version: 2 },
      });
    setup();
    const unit = screen.getByRole('combobox', { name: 'Unit for row 1' });
    expect(unit).toHaveValue('Bag (bag)');
    expect(getUnitsOfMeasurementMock).not.toHaveBeenCalled();
    const quantity = screen.getByRole('spinbutton', {
      name: 'Quantity for row 1',
    });
    await user.clear(quantity);
    await user.type(quantity, '25');
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    expect(await screen.findByText('Unit is unavailable')).toBeVisible();
    expect(unit).toHaveAccessibleDescription('Unit is unavailable');
    await user.click(unit);
    await user.clear(unit);
    await user.click(await screen.findByRole('option', { name: 'Piece' }));
    expect(
      screen.getByRole('combobox', { name: 'Unit for row 1' })
    ).toHaveValue('Piece');
    expect(
      screen.queryByRole('combobox', { name: 'Unit for row 3' })
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    await waitFor(() =>
      expect(updateSupplyMock).toHaveBeenLastCalledWith({
        supplyId: 9,
        expectedVersion: 1,
        supplyEntries: [
          {
            productVariantId: 11,
            unitOfMeasurementId: 3,
            quantity: 25,
            unitPrice: 28,
            comment: null,
          },
        ],
      })
    );
    await waitFor(() =>
      expect(screen.queryByText('Unit is unavailable')).not.toBeInTheDocument()
    );
  });

  it('requires a unit after clearing it from a populated entry', async () => {
    const user = userEvent.setup();
    setup();
    await user.clear(screen.getByRole('combobox', { name: 'Unit for row 1' }));
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    expect(await screen.findByText('Select a unit')).toBeVisible();
    expect(updateSupplyMock).not.toHaveBeenCalled();
  });

  it('saves edits to an existing draft with its version and full entry list', async () => {
    const user = userEvent.setup();
    const updatedSupply = {
      ...savedSupply,
      totalQuantity: 25,
      totalPrice: 700,
      version: 2,
      supplyEntries: savedSupply.supplyEntries.map((entry) => ({
        ...entry,
        quantity: 25,
      })),
    };
    updateSupplyMock.mockResolvedValue({
      ok: true,
      data: updatedSupply,
    });
    const { queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await user.clear(
      screen.getByRole('spinbutton', { name: 'Quantity for row 1' })
    );
    await user.type(
      screen.getByRole('spinbutton', { name: 'Quantity for row 1' }),
      '25'
    );
    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    await waitFor(() => {
      expect(updateSupplyMock).toHaveBeenCalledWith({
        supplyId: 9,
        expectedVersion: 1,
        supplyEntries: [
          {
            productVariantId: 11,
            unitOfMeasurementId: 2,
            quantity: 25,
            unitPrice: 28,
            comment: null,
          },
        ],
      });
    });
    expect(screen.getByText('Draft')).toBeVisible();
    expect(screen.queryByText('Status')).not.toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Save draft' })).toBeEnabled();
    });
    expect(queryClient.getQueryData(suppliesQueryKeys.detail(9))).toEqual(
      updatedSupply
    );
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: suppliesQueryKeys.list,
    });
  });

  it('finalizes the current draft after confirmation and updates its cache', async () => {
    const completedSupply = {
      ...savedSupply,
      status: SUPPLY_STATUS.COMPLETED,
      version: 2,
    };
    updateSupplyMock.mockResolvedValue({ ok: true, data: completedSupply });
    const user = userEvent.setup();
    const { queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await user.click(screen.getByRole('button', { name: 'Finalize supply' }));
    expect(updateSupplyMock).not.toHaveBeenCalled();
    await user.click(
      within(screen.getByRole('dialog', { name: 'Finalize supply' })).getByRole(
        'button',
        { name: 'Finalize supply' }
      )
    );

    await waitFor(() =>
      expect(queryClient.getQueryData(suppliesQueryKeys.detail(9))).toEqual(
        completedSupply
      )
    );
    expect(updateSupplyMock).toHaveBeenCalledWith({
      supplyId: 9,
      expectedVersion: 1,
      status: SUPPLY_STATUS.COMPLETED,
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: suppliesQueryKeys.list,
    });
  });

  it('keeps the persisted cache unchanged when an update fails', async () => {
    updateSupplyMock.mockResolvedValue({
      ok: false,
      error: { status: 409, message: 'Supply was changed by another user.' },
    });
    const user = userEvent.setup();
    const { queryClient } = setup();
    queryClient.setQueryData(suppliesQueryKeys.detail(9), savedSupply);
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await user.type(
      screen.getByRole('textbox', { name: 'Supply number' }),
      '-edited'
    );
    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    expect(
      await screen.findByText('Supply was changed by another user.')
    ).toBeVisible();
    expect(queryClient.getQueryData(suppliesQueryKeys.detail(9))).toEqual(
      savedSupply
    );
    expect(invalidateQueriesSpy).not.toHaveBeenCalled();
  });
});
