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

  it('starts with one empty product row and cannot finalize it', () => {
    setup();

    expect(screen.getByRole('table', { name: 'Supply entries' })).toBeVisible();
    expect(
      screen.getByRole('combobox', { name: 'Product for row 1' })
    ).toBeVisible();
    expect(
      screen.queryByRole('checkbox', { name: 'Select all supply entries' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Finalize supply' })
    ).toBeDisabled();
  });

  it('turns a selected product into an editable row and appends a blank row', async () => {
    const user = userEvent.setup();
    setup();

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Product for row 1' }),
      '11'
    );

    expect(
      screen.getByRole('combobox', { name: 'Product for row 2' })
    ).toHaveValue('');
    expect(
      screen.getByRole('checkbox', { name: 'Select Jasmine Rice 5kg' })
    ).toBeVisible();
    expect(
      screen.getByRole('spinbutton', { name: 'Quantity for row 1' })
    ).not.toHaveAttribute('readonly');
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
      screen.getByRole('combobox', { name: 'Product for row 1' })
    ).toHaveValue('');
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

    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    expect(
      await screen.findByRole('button', { name: 'Saving...' })
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Finalize supply' })
    ).toBeDisabled();
    expect(mocks.replace).not.toHaveBeenCalled();

    await act(async () => invalidation.resolve());

    expect(
      await screen.findByRole('button', { name: 'Save draft' })
    ).toBeEnabled();
    expect(mocks.replace).toHaveBeenCalledWith('/products/supplies/9');
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
