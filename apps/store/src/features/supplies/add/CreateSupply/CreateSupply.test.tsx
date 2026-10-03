import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createSupply, updateSupply } from '@/lib/client/api/supplies';
import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import type { SupplyDetails } from '@/lib/domain/supplies/types';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateSupply } from './CreateSupply';

const mocks = vi.hoisted(() => ({
  createSupply: vi.fn(),
  updateSupply: vi.fn(),
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
  updateSupply: mocks.updateSupply,
}));

vi.mock('./selectors', () => {
  type MockOption = {
    data?: unknown;
    displayValue: string;
    label?: string;
    value: string;
  };

  type MockSelectorProps = {
    'aria-label'?: string;
    disabled?: boolean;
    errorText?: string;
    label?: string;
    onOptionSelect?: (option: MockOption | null) => void;
    onValueChange?: (value: string | null) => void;
    staticOptions?: MockOption[];
    value?: string | null;
  };

  const makeSelector =
    (options: MockOption[]) =>
    ({
      'aria-label': ariaLabel,
      disabled,
      errorText,
      label,
      onOptionSelect,
      onValueChange,
      staticOptions = [],
      value,
    }: MockSelectorProps) => {
      const optionsByValue = new Map(
        [...staticOptions, ...options].map((option) => [option.value, option])
      );

      return (
        <>
          <select
            aria-label={ariaLabel ?? label}
            disabled={disabled}
            onChange={(event) => {
              const nextValue = event.currentTarget.value || null;
              onValueChange?.(nextValue);
              onOptionSelect?.(
                nextValue ? (optionsByValue.get(nextValue) ?? null) : null
              );
            }}
            value={value ?? ''}
          >
            <option value="">Select</option>
            {[...optionsByValue.values()].map((option) => (
              <option key={option.value} value={option.value}>
                {option.displayValue}
              </option>
            ))}
          </select>
          {errorText ? <span role="alert">{errorText}</span> : null}
        </>
      );
    };

  return {
    SuppliersAsyncCombobox: makeSelector([
      { displayValue: 'Global Foods', value: '3' },
    ]),
    WarehousesAsyncCombobox: makeSelector([
      { displayValue: 'Main Warehouse', value: '4' },
    ]),
    ProductVariantsAsyncCombobox: makeSelector([
      {
        data: { id: 11, name: 'Jasmine Rice 5kg', sku: 'RICE-5KG' },
        displayValue: 'Jasmine Rice 5kg',
        value: '11',
      },
    ]),
    UnitsOfMeasurementAsyncCombobox: makeSelector([
      { displayValue: 'Bag (bag)', value: '2' },
    ]),
  };
});

const createSupplyMock = vi.mocked(createSupply);
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
    updateSupplyMock.mockReset();
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
    setup();
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
    expect(mocks.replace).toHaveBeenCalledWith('/products/supplies/9');
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

  it('saves edits to an existing draft with its version and full entry list', async () => {
    const user = userEvent.setup();
    updateSupplyMock.mockResolvedValue({
      ok: true,
      data: { ...savedSupply, totalQuantity: 25, totalPrice: 700, version: 2 },
    });
    setup({ initialSupply: savedSupply });

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
    expect(mocks.replace).not.toHaveBeenCalled();
  });

  it('keeps a completed supply read-only without save or selection actions', () => {
    setup({
      initialSupply: { ...savedSupply, status: SUPPLY_STATUS.COMPLETED },
    });

    expect(screen.getByRole('combobox', { name: 'Supplier' })).toBeDisabled();
    expect(
      screen.getByRole('combobox', { name: 'Product for row 1' })
    ).toBeDisabled();
    expect(
      screen.getByRole('spinbutton', { name: 'Quantity for row 1' })
    ).toHaveAttribute('readonly');
    expect(
      screen.queryByRole('combobox', { name: 'Product for row 2' })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save draft' })).toBeNull();
    expect(screen.queryByRole('checkbox')).toBeNull();
  });
});
