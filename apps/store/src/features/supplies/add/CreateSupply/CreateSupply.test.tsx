import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createSupply } from '@/lib/client/api/supplies';
import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import type { SupplyDetails } from '@/lib/domain/supplies/types';
import { suppliesQueryKeys } from '@/lib/query/supplies/suppliesQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import type {
  SupplyProductVariantSelection,
  SupplySupplierSelection,
  SupplyUnitOfMeasurementSelection,
  SupplyWarehouseSelection,
} from '../../shared/SupplyEditorForm/types';
import { CreateSupply } from './CreateSupply';

const mocks = vi.hoisted(() => ({
  createSupply: vi.fn(),
  replace: vi.fn(),
}));

vi.mock('next/navigation', async () => ({
  ...(await vi.importActual<typeof import('next/navigation')>(
    'next/navigation'
  )),
  useRouter: () => ({ replace: mocks.replace }),
}));

vi.mock('@/lib/client/api/supplies', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/supplies')>(
    '@/lib/client/api/supplies'
  )),
  createSupply: mocks.createSupply,
}));

vi.mock('../../shared/SupplyEditorForm/selectors', async () => {
  return {
    ...(await vi.importActual<
      typeof import('../../shared/SupplyEditorForm/selectors')
    >('../../shared/SupplyEditorForm/selectors')),
    SuppliersAsyncCombobox: ({
      value,
      onValueChange,
      label,
      errorText,
    }: {
      value: SupplySupplierSelection | null;
      onValueChange: (value: SupplySupplierSelection | null) => void;
      label: string;
      errorText?: string;
    }) => (
      <>
        <select
          aria-label={label}
          value={value?.id ?? ''}
          onChange={(event) =>
            onValueChange(
              event.currentTarget.value
                ? { id: 3, name: 'Global Foods', status: 'ACTIVE' }
                : null
            )
          }
        >
          <option value="">Select</option>
          <option value="3">Global Foods</option>
        </select>
        {errorText ? <span role="alert">{errorText}</span> : null}
      </>
    ),
    WarehousesAsyncCombobox: ({
      value,
      onValueChange,
      label,
      errorText,
    }: {
      value: SupplyWarehouseSelection | null;
      onValueChange: (value: SupplyWarehouseSelection | null) => void;
      label: string;
      errorText?: string;
    }) => (
      <>
        <select
          aria-label={label}
          value={value?.id ?? ''}
          onChange={(event) =>
            onValueChange(
              event.currentTarget.value
                ? { id: 4, name: 'Main Warehouse', status: 'ACTIVE' }
                : null
            )
          }
        >
          <option value="">Select</option>
          <option value="4">Main Warehouse</option>
        </select>
        {errorText ? <span role="alert">{errorText}</span> : null}
      </>
    ),
    ProductVariantsAsyncCombobox: ({
      'aria-label': ariaLabel,
      value,
      onValueChange,
      errorText,
    }: {
      'aria-label': string;
      value: SupplyProductVariantSelection | null;
      onValueChange: (value: SupplyProductVariantSelection | null) => void;
      errorText?: string;
    }) => (
      <>
        <select
          aria-label={ariaLabel}
          value={value?.id ?? ''}
          onChange={(event) =>
            onValueChange(
              event.currentTarget.value
                ? { id: 11, name: 'Jasmine Rice 5kg', sku: 'RICE-5KG' }
                : null
            )
          }
        >
          <option value="">Select</option>
          <option value="11">Jasmine Rice 5kg</option>
        </select>
        {errorText ? <span role="alert">{errorText}</span> : null}
      </>
    ),
    UnitsOfMeasurementAsyncCombobox: ({
      'aria-label': ariaLabel,
      value,
      onValueChange,
      errorText,
    }: {
      'aria-label': string;
      value: SupplyUnitOfMeasurementSelection | null;
      onValueChange: (value: SupplyUnitOfMeasurementSelection | null) => void;
      errorText?: string;
    }) => (
      <>
        <select
          aria-label={ariaLabel}
          value={value?.id ?? ''}
          onChange={(event) =>
            onValueChange(
              event.currentTarget.value
                ? { id: 2, name: 'Bag', symbol: 'bag', status: 'ACTIVE' }
                : null
            )
          }
        >
          <option value="">Select</option>
          <option value="2">Bag (bag)</option>
        </select>
        {errorText ? <span role="alert">{errorText}</span> : null}
      </>
    ),
  };
});

const createSupplyMock = vi.mocked(createSupply);

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

const { setup } = prepareStoreSetup({ component: CreateSupply });

const fillMetadata = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.selectOptions(
    screen.getByRole('combobox', { name: 'Supplier' }),
    '3'
  );
  await user.selectOptions(
    screen.getByRole('combobox', { name: 'Warehouse' }),
    '4'
  );
  await user.type(
    screen.getByRole('textbox', { name: /Supply number/ }),
    ' SUP-001 '
  );
};

const addCompleteEntry = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.selectOptions(
    screen.getByRole('combobox', { name: 'Product for row 1' }),
    '11'
  );
  await user.selectOptions(
    screen.getByRole('combobox', { name: 'Unit for row 1' }),
    '2'
  );
  await user.type(
    screen.getByRole('spinbutton', { name: 'Quantity for row 1' }),
    '20'
  );
  await user.type(
    screen.getByRole('spinbutton', { name: 'Unit price for row 1' }),
    '28'
  );
};

describe('CreateSupply', () => {
  beforeEach(() => {
    createSupplyMock.mockReset();
    mocks.replace.mockReset();
  });

  it('validates supply number edits and clears the error when corrected', async () => {
    const user = userEvent.setup();
    setup();
    const number = screen.getByRole('textbox', { name: /Supply number/ });

    expect(
      screen.queryByText('Supply number is required')
    ).not.toBeInTheDocument();
    await user.type(number, ' ');
    expect(number).toHaveAccessibleDescription('Supply number is required');
    await user.type(number, 'SUP-001');
    expect(
      screen.queryByText('Supply number is required')
    ).not.toBeInTheDocument();
    await user.clear(number);
    expect(number).toHaveAccessibleDescription('Supply number is required');
    expect(createSupplyMock).not.toHaveBeenCalled();
  });

  it('updates required field errors after a rejected submission without another submit', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    expect(screen.getByText('Select a supplier')).toBeVisible();
    expect(screen.getByText('Select a warehouse')).toBeVisible();
    expect(screen.getByText('Supply number is required')).toBeVisible();

    await fillMetadata(user);
    expect(screen.queryByText('Select a supplier')).not.toBeInTheDocument();
    expect(screen.queryByText('Select a warehouse')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Supply number is required')
    ).not.toBeInTheDocument();
    expect(createSupplyMock).not.toHaveBeenCalled();
  });

  it('revalidates partially filled rows live after submit and ignores a cleared blank row', async () => {
    const user = userEvent.setup();
    setup();
    await fillMetadata(user);
    const comment = screen.getByRole('textbox', { name: 'Comment for row 1' });
    await user.type(comment, 'Note');
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    expect(screen.getByText('Select a product')).toBeVisible();
    expect(screen.getByText('Select a unit')).toBeVisible();
    expect(screen.getByText('Quantity is required')).toBeVisible();
    expect(screen.getByText('Unit price is required')).toBeVisible();

    const quantity = screen.getByRole('spinbutton', {
      name: 'Quantity for row 1',
    });
    await user.type(quantity, '0');
    expect(quantity).toHaveAccessibleDescription(
      'Quantity must be a whole number greater than 0'
    );
    await user.clear(quantity);
    await user.type(quantity, '2');
    expect(quantity).not.toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Select a unit')).toBeVisible();
    await user.clear(quantity);
    await user.clear(comment);
    expect(screen.queryByText('Select a product')).not.toBeInTheDocument();
    expect(screen.queryByText('Select a unit')).not.toBeInTheDocument();
    expect(screen.queryByText('Quantity is required')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Unit price is required')
    ).not.toBeInTheDocument();
    expect(createSupplyMock).not.toHaveBeenCalled();
  });

  it('blocks finalization for an incomplete extra row and allows it after that row is cleared', async () => {
    const user = userEvent.setup();
    createSupplyMock.mockResolvedValue({ ok: true, data: savedSupply });
    setup();
    await fillMetadata(user);
    await addCompleteEntry(user);
    await user.click(
      screen.getByRole('button', { name: '+ Add another product' })
    );
    const comment = screen.getByRole('textbox', { name: 'Comment for row 2' });
    await user.type(comment, 'Incomplete extra row');
    await user.click(screen.getByRole('button', { name: 'Finalize supply' }));
    await user.click(
      within(screen.getByRole('dialog', { name: 'Finalize supply' })).getByRole(
        'button',
        { name: 'Finalize supply' }
      )
    );

    expect(
      screen.getByRole('spinbutton', { name: 'Quantity for row 2' })
    ).toHaveAccessibleDescription('Quantity is required');
    expect(screen.getByText('Select a product')).toBeVisible();
    expect(createSupplyMock).not.toHaveBeenCalled();

    await user.clear(comment);
    expect(screen.queryByText('Quantity is required')).not.toBeInTheDocument();
    expect(screen.queryByText('Select a product')).not.toBeInTheDocument();
    await user.type(comment, 'Another note');
    expect(screen.getByText('Quantity is required')).toBeVisible();
    await user.clear(comment);
    await user.click(screen.getByRole('button', { name: 'Finalize supply' }));
    await user.click(
      within(screen.getByRole('dialog', { name: 'Finalize supply' })).getByRole(
        'button',
        { name: 'Finalize supply' }
      )
    );

    await waitFor(() =>
      expect(createSupplyMock).toHaveBeenCalledExactlyOnceWith({
        supplierId: 3,
        warehouseId: 4,
        supplyNumber: 'SUP-001',
        supplyEntries: [
          {
            productVariantId: 11,
            unitOfMeasurementId: 2,
            quantity: 20,
            unitPrice: 28,
          },
        ],
        status: SUPPLY_STATUS.COMPLETED,
      })
    );
  });

  it('starts with one empty product row and cannot finalize it', () => {
    setup();

    expect(screen.getByRole('table', { name: 'Supply entries' })).toBeVisible();
    expect(
      screen.getByRole('img', { name: 'Product image unavailable' })
    ).toBeVisible();
    expect(
      screen.getByRole('combobox', { name: 'Product for row 1' })
    ).toBeVisible();
    expect(
      screen.getByRole('checkbox', { name: 'Select all supply entries' })
    ).toBeVisible();
    expect(
      screen.getByRole('checkbox', { name: 'Select supply entry' })
    ).toBeEnabled();
    expect(
      screen.getByRole('button', { name: 'Finalize supply' })
    ).toBeDisabled();
  });

  it('selects and deletes the initial empty row', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(
      screen.getByRole('checkbox', { name: 'Select supply entry' })
    );

    expect(
      screen.getByRole('checkbox', { name: 'Select all supply entries' })
    ).toBeChecked();
    const bulkActions = screen.getByRole('complementary', {
      name: 'Supply entry bulk actions',
    });
    expect(within(bulkActions).getByText('1 selected')).toBeVisible();
    await user.click(
      within(bulkActions).getByRole('button', { name: 'Delete' })
    );

    expect(screen.getByText('No products in this supply.')).toBeVisible();
    expect(
      screen.getByRole('button', { name: '+ Add another product' })
    ).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Save draft' })).toBeVisible();
  });

  it('adds a row only on request and disables adding until the last row has a product', async () => {
    const user = userEvent.setup();
    setup();
    const addProduct = screen.getByRole('button', {
      name: '+ Add another product',
    });
    expect(addProduct).toBeDisabled();

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Product for row 1' }),
      '11'
    );

    expect(
      screen.queryByRole('combobox', { name: 'Product for row 2' })
    ).not.toBeInTheDocument();
    expect(addProduct).toBeEnabled();
    expect(
      screen.getByRole('img', { name: 'Product image unavailable' })
    ).toBeVisible();
    expect(
      screen.getByRole('checkbox', { name: 'Select Jasmine Rice 5kg' })
    ).toBeVisible();
    expect(
      screen.getByRole('spinbutton', { name: 'Quantity for row 1' })
    ).not.toHaveAttribute('readonly');
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Product for row 1' }),
      ''
    );
    expect(addProduct).toBeDisabled();
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Product for row 1' }),
      '11'
    );
    await user.click(addProduct);
    expect(
      screen.getByRole('combobox', { name: 'Product for row 2' })
    ).toHaveValue('');
    expect(addProduct).toBeDisabled();
    await user.click(addProduct);
    await user.click(
      screen.getByRole('checkbox', { name: 'Select all supply entries' })
    );
    expect(
      screen.getByRole('checkbox', { name: 'Select Jasmine Rice 5kg' })
    ).toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: 'Select supply entry' })
    ).toBeChecked();
    expect(
      screen.queryByRole('combobox', { name: 'Product for row 3' })
    ).not.toBeInTheDocument();
    expect(createSupplyMock).not.toHaveBeenCalled();
  });

  it('replaces the save actions with a bulk delete action for selected entries', async () => {
    const user = userEvent.setup();
    setup();
    await addCompleteEntry(user);

    await user.click(
      screen.getByRole('checkbox', { name: 'Select Jasmine Rice 5kg' })
    );

    const bulkActions = screen.getByRole('complementary', {
      name: 'Supply entry bulk actions',
    });
    expect(within(bulkActions).getByText('1 selected')).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Save draft' })).toBeNull();

    await user.click(
      within(bulkActions).getByRole('button', { name: 'Delete' })
    );

    expect(
      screen.queryByRole('checkbox', { name: 'Select Jasmine Rice 5kg' })
    ).toBeNull();
    expect(
      screen.queryByRole('combobox', { name: 'Product for row 1' })
    ).not.toBeInTheDocument();
    const addProduct = screen.getByRole('button', {
      name: '+ Add another product',
    });
    expect(addProduct).toBeEnabled();
    await user.click(addProduct);
    expect(
      screen.getByRole('combobox', { name: 'Product for row 1' })
    ).toHaveValue('');
    expect(addProduct).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Save draft' })).toBeVisible();
  });

  it('saves a metadata-only draft without submitting the blank product row', async () => {
    const user = userEvent.setup();
    createSupplyMock.mockResolvedValue({ ok: true, data: savedSupply });
    const { queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
    await fillMetadata(user);

    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    await waitFor(() => {
      expect(createSupplyMock).toHaveBeenCalledWith({
        supplierId: 3,
        warehouseId: 4,
        supplyNumber: 'SUP-001',
        supplyEntries: [],
        status: SUPPLY_STATUS.DRAFT,
      });
    });
    await waitFor(() => {
      expect(mocks.replace).toHaveBeenCalledWith('/products/supplies/9');
    });
    expect(queryClient.getQueryData(suppliesQueryKeys.detail(9))).toEqual(
      savedSupply
    );
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: suppliesQueryKeys.list,
    });
  });

  it('submits COMPLETED only after confirming finalization', async () => {
    const user = userEvent.setup();
    createSupplyMock.mockResolvedValue({ ok: true, data: savedSupply });
    setup();
    await fillMetadata(user);
    await addCompleteEntry(user);

    await user.click(screen.getByRole('button', { name: 'Finalize supply' }));

    const dialog = screen.getByRole('dialog', { name: 'Finalize supply' });
    expect(dialog).toBeVisible();
    expect(createSupplyMock).not.toHaveBeenCalled();

    await user.click(
      within(dialog).getByRole('button', { name: 'Finalize supply' })
    );

    await waitFor(() => {
      expect(createSupplyMock).toHaveBeenCalledWith({
        supplierId: 3,
        warehouseId: 4,
        supplyNumber: 'SUP-001',
        supplyEntries: [
          {
            productVariantId: 11,
            unitOfMeasurementId: 2,
            quantity: 20,
            unitPrice: 28,
          },
        ],
        status: SUPPLY_STATUS.COMPLETED,
      });
    });
  });

  it('can save an empty draft after a failed finalization and removal of its entry', async () => {
    const user = userEvent.setup();
    createSupplyMock.mockResolvedValue({ ok: true, data: savedSupply });
    setup();
    await fillMetadata(user);
    await addCompleteEntry(user);
    const number = screen.getByRole('textbox', { name: /Supply number/ });
    await user.clear(number);
    await user.click(screen.getByRole('button', { name: 'Finalize supply' }));
    await user.click(
      within(screen.getByRole('dialog', { name: 'Finalize supply' })).getByRole(
        'button',
        { name: 'Finalize supply' }
      )
    );
    expect(number).toHaveAccessibleDescription('Supply number is required');
    expect(createSupplyMock).not.toHaveBeenCalled();

    await user.type(number, 'SUP-001');
    await user.click(
      screen.getByRole('checkbox', { name: 'Select Jasmine Rice 5kg' })
    );
    await user.click(
      within(
        screen.getByRole('complementary', { name: 'Supply entry bulk actions' })
      ).getByRole('button', { name: 'Delete' })
    );
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    await waitFor(() =>
      expect(createSupplyMock).toHaveBeenCalledExactlyOnceWith({
        supplierId: 3,
        warehouseId: 4,
        supplyNumber: 'SUP-001',
        supplyEntries: [],
        status: SUPPLY_STATUS.DRAFT,
      })
    );
  });

  it('keeps caches and navigation unchanged when saving fails', async () => {
    const user = userEvent.setup();
    createSupplyMock.mockResolvedValue({
      ok: false,
      error: { message: 'Could not save the supply.', status: 500 },
    });
    const { queryClient } = setup();
    const setQueryDataSpy = vi.spyOn(queryClient, 'setQueryData');
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
    await fillMetadata(user);

    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    expect(await screen.findByText('Could not save the supply.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Save draft' })).toBeEnabled();
    expect(setQueryDataSpy).not.toHaveBeenCalled();
    expect(invalidateQueriesSpy).not.toHaveBeenCalled();
    expect(mocks.replace).not.toHaveBeenCalled();
  });

  it('keeps save actions pending until the workflow callback finishes', async () => {
    const user = userEvent.setup();
    createSupplyMock.mockResolvedValue({ ok: true, data: savedSupply });
    const { queryClient } = setup();
    const invalidation = Promise.withResolvers<void>();
    vi.spyOn(queryClient, 'invalidateQueries').mockReturnValue(
      invalidation.promise
    );
    await fillMetadata(user);
    await addCompleteEntry(user);
    const addProduct = screen.getByRole('button', {
      name: '+ Add another product',
    });
    expect(addProduct).toBeEnabled();

    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    expect(
      await screen.findByRole('button', { name: 'Saving...' })
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Finalize supply' })
    ).toBeDisabled();
    expect(mocks.replace).not.toHaveBeenCalled();
    expect(addProduct).toBeDisabled();

    await act(async () => invalidation.resolve());

    expect(
      await screen.findByRole('button', { name: 'Save draft' })
    ).toBeEnabled();
    expect(mocks.replace).toHaveBeenCalledWith('/products/supplies/9');
    expect(addProduct).toBeEnabled();
  });

  it('restores save actions after validation rejects a submission', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    expect(await screen.findByText('Supply number is required')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Save draft' })).toBeEnabled();
    expect(createSupplyMock).not.toHaveBeenCalled();
  });
});
