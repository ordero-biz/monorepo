import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getSupply, updateSupply } from '@/lib/client/api/supplies';
import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import type { SupplyDetails } from '@/lib/domain/supplies/types';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { SupplyDetail } from './SupplyDetail';

vi.mock('@/lib/client/api/supplies', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/supplies')>(
    '@/lib/client/api/supplies'
  )),
  getSupply: vi.fn(),
  updateSupply: vi.fn(),
}));

const getSupplyMock = vi.mocked(getSupply);
const updateSupplyMock = vi.mocked(updateSupply);

const { setup } = prepareStoreSetup({
  component: SupplyDetail,
  props: {
    supplyId: '9',
  },
});

const supply = {
  id: 9,
  supplier: { id: 1, name: 'Fresh Farms', status: 'ACTIVE' },
  warehouse: { id: 2, name: 'Main Warehouse', status: 'ACTIVE' },
  status: SUPPLY_STATUS.DRAFT,
  supplyNumber: 'SUP-009',
  totalQuantity: 2,
  totalPrice: 10,
  supplyEntries: [
    {
      id: 17,
      productVariant: { id: 11, name: 'Rice' },
      unitOfMeasurement: { id: 3, name: 'Bag', status: 'ACTIVE' },
      quantity: 2,
      unitPrice: 5,
    },
  ],
  version: 1,
} satisfies SupplyDetails;

describe('SupplyDetail', () => {
  beforeEach(() => {
    getSupplyMock.mockReset();
    updateSupplyMock.mockReset();
  });

  it('opens the saved supply in the editor', async () => {
    getSupplyMock.mockResolvedValue({ ok: true, data: supply });

    setup();

    expect(
      await screen.findByRole('textbox', { name: 'Supply number' })
    ).toHaveValue('SUP-009');
    expect(getSupplyMock).toHaveBeenCalledWith('9');
  });

  it('displays completed supplies without opening the editor', async () => {
    getSupplyMock.mockResolvedValue({
      ok: true,
      data: { ...supply, status: SUPPLY_STATUS.COMPLETED },
    });

    setup();

    expect(await screen.findByText('Completed')).toBeVisible();
    expect(screen.getByText('Fresh Farms')).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Save draft' })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('switches to the read-only view after the user finalizes the draft', async () => {
    getSupplyMock.mockResolvedValue({ ok: true, data: supply });
    updateSupplyMock.mockResolvedValue({
      ok: true,
      data: {
        ...supply,
        status: SUPPLY_STATUS.COMPLETED,
        version: 2,
      },
    });
    const user = userEvent.setup();
    setup();

    await user.click(
      await screen.findByRole('button', { name: 'Finalize supply' })
    );
    expect(updateSupplyMock).not.toHaveBeenCalled();
    await user.click(
      within(screen.getByRole('dialog', { name: 'Finalize supply' })).getByRole(
        'button',
        { name: 'Finalize supply' }
      )
    );

    expect(await screen.findByText('Completed')).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Save draft' })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Supply entries' })).toBeVisible();
    expect(updateSupplyMock).toHaveBeenCalledWith({
      supplyId: 9,
      expectedVersion: 1,
      status: SUPPLY_STATUS.COMPLETED,
    });
  });

  it('uses the saved response as the baseline and version for subsequent saves', async () => {
    const savedSupply = { ...supply, supplyNumber: 'SUP-010', version: 2 };
    getSupplyMock.mockResolvedValue({ ok: true, data: supply });
    updateSupplyMock
      .mockResolvedValueOnce({ ok: true, data: savedSupply })
      .mockResolvedValueOnce({
        ok: true,
        data: { ...savedSupply, supplierInvoiceNumber: 'INV-001', version: 3 },
      });
    const user = userEvent.setup();
    setup();

    const numberInput = await screen.findByRole('textbox', {
      name: 'Supply number',
    });
    await user.clear(numberInput);
    await user.type(numberInput, ' SUP-010 ');
    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    await waitFor(() =>
      expect(
        screen.getByRole('textbox', { name: 'Supply number' })
      ).toHaveValue('SUP-010')
    );
    expect(updateSupplyMock).toHaveBeenNthCalledWith(1, {
      supplyId: 9,
      expectedVersion: 1,
      supplyNumber: 'SUP-010',
    });

    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    expect(await screen.findByText('No changes to save.')).toBeVisible();
    expect(updateSupplyMock).toHaveBeenCalledTimes(1);

    await user.type(
      screen.getByRole('textbox', { name: 'Supplier invoice number' }),
      'INV-001'
    );
    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    await waitFor(() =>
      expect(updateSupplyMock).toHaveBeenNthCalledWith(2, {
        supplyId: 9,
        expectedVersion: 2,
        supplierInvoiceNumber: 'INV-001',
      })
    );
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Save draft' })).toBeEnabled()
    );
  });

  it('preserves edits and the current version after a failed save so the user can retry', async () => {
    getSupplyMock.mockResolvedValue({ ok: true, data: supply });
    updateSupplyMock
      .mockResolvedValueOnce({
        ok: false,
        error: { status: 500, message: 'Could not save the supply.' },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: { ...supply, supplyNumber: 'SUP-010', version: 2 },
      });
    const user = userEvent.setup();
    setup();

    const numberInput = await screen.findByRole('textbox', {
      name: 'Supply number',
    });
    await user.clear(numberInput);
    await user.type(numberInput, 'SUP-010');
    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    expect(await screen.findByText('Could not save the supply.')).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Supply number' })).toHaveValue(
      'SUP-010'
    );
    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    expect(await screen.findByText('Supply draft saved.')).toBeVisible();
    expect(updateSupplyMock).toHaveBeenCalledTimes(2);
    expect(updateSupplyMock).toHaveBeenNthCalledWith(2, {
      supplyId: 9,
      expectedVersion: 1,
      supplyNumber: 'SUP-010',
    });
  });

  it('retries when the supply cannot be loaded', async () => {
    getSupplyMock
      .mockResolvedValueOnce({
        ok: false,
        error: { status: 500, message: 'Could not load supply.' },
      })
      .mockResolvedValueOnce({ ok: true, data: supply });
    const user = userEvent.setup();

    setup();

    expect(
      await screen.findByText("We couldn't load this supply right now.")
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(
      await screen.findByRole('textbox', { name: 'Supply number' })
    ).toHaveValue('SUP-009');
    expect(getSupplyMock).toHaveBeenCalledTimes(2);
  });
});
