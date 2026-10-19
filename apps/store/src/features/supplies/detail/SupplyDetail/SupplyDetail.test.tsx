import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getSupply, updateSupply } from '@/lib/client/api/supplies';
import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import type { SupplyDetails } from '@/lib/domain/supplies/types';
import { suppliesQueryKeys } from '@/lib/query/supplies/suppliesQueryKeys';
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

  it('refreshes an untouched editor and uses the refreshed baseline for saving', async () => {
    getSupplyMock.mockResolvedValue({ ok: true, data: supply });
    const user = userEvent.setup();
    const { queryClient } = setup();
    await screen.findByRole('textbox', { name: 'Supply number' });
    const refreshedSupply = {
      ...supply,
      supplyNumber: 'SUP-REFRESHED',
      warehouse: { ...supply.warehouse, id: 3, name: 'New warehouse' },
      version: 2,
    };
    getSupplyMock.mockResolvedValue({ ok: true, data: refreshedSupply });

    await act(() =>
      queryClient.invalidateQueries({ queryKey: suppliesQueryKeys.detail(9) })
    );

    await waitFor(() =>
      expect(
        screen.getByRole('textbox', { name: 'Supply number' })
      ).toHaveValue('SUP-REFRESHED')
    );
    expect(screen.getByRole('combobox', { name: 'Warehouse' })).toHaveValue(
      'New warehouse'
    );
    updateSupplyMock.mockResolvedValue({
      ok: true,
      data: { ...refreshedSupply, supplierInvoiceNumber: 'INV-2', version: 3 },
    });
    await user.type(
      screen.getByRole('textbox', { name: 'Supplier invoice number' }),
      'INV-2'
    );
    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    expect(updateSupplyMock).toHaveBeenCalledExactlyOnceWith({
      supplyId: 9,
      expectedVersion: 2,
      supplierInvoiceNumber: 'INV-2',
    });
  });

  it('preserves edits and the original PATCH baseline when a newer supply arrives', async () => {
    getSupplyMock.mockResolvedValue({ ok: true, data: supply });
    const user = userEvent.setup();
    const { queryClient } = setup();
    await user.type(
      await screen.findByRole('textbox', { name: 'Supplier invoice number' }),
      'UNSAVED-INVOICE'
    );
    getSupplyMock.mockResolvedValue({
      ok: true,
      data: {
        ...supply,
        supplyNumber: 'SERVER-UPDATE',
        warehouse: { ...supply.warehouse, id: 3, name: 'New warehouse' },
        version: 2,
      },
    });

    await act(() =>
      queryClient.invalidateQueries({ queryKey: suppliesQueryKeys.detail(9) })
    );

    const notice = await screen.findByRole('dialog', {
      name: 'Supply changed',
    });
    expect(
      within(notice).getByText(/Your unsaved edits are preserved/)
    ).toBeVisible();
    await user.click(
      within(notice).getByRole('button', { name: 'Keep editing' })
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Supplier invoice number' })
    ).toHaveValue('UNSAVED-INVOICE');
    expect(screen.getByRole('textbox', { name: 'Supply number' })).toHaveValue(
      'SUP-009'
    );
    updateSupplyMock.mockResolvedValue({
      ok: false,
      error: {
        status: 409,
        message: 'This supply was changed by another user.',
      },
    });
    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    expect(updateSupplyMock).toHaveBeenCalledExactlyOnceWith({
      supplyId: 9,
      expectedVersion: 1,
      supplierInvoiceNumber: 'UNSAVED-INVOICE',
    });
    expect(
      await screen.findByText('This supply was changed by another user.')
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: 'Supplier invoice number' })
    ).toHaveValue('UNSAVED-INVOICE');
  });

  it('announces each newer version in a dismissible dialog and lets the user review it again', async () => {
    getSupplyMock.mockResolvedValue({ ok: true, data: supply });
    const user = userEvent.setup();
    const { queryClient } = setup();
    await user.type(
      await screen.findByRole('textbox', { name: 'Comment' }),
      'My edits'
    );
    const latest = { ...supply, supplyNumber: 'SAVED-NUMBER', version: 2 };
    getSupplyMock.mockResolvedValue({ ok: true, data: latest });
    await act(() =>
      queryClient.invalidateQueries({ queryKey: suppliesQueryKeys.detail(9) })
    );

    const notice = await screen.findByRole('dialog', {
      name: 'Supply changed',
    });
    expect(notice).toHaveAccessibleDescription(
      /A newer version of this supply is available/
    );
    await user.click(
      within(notice).getByRole('button', { name: 'Keep editing' })
    );
    await user.type(
      screen.getByRole('textbox', { name: 'Comment' }),
      ' continued'
    );
    await act(() =>
      queryClient.invalidateQueries({ queryKey: suppliesQueryKeys.detail(9) })
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(
      screen.queryByText(/A newer version of this supply is available/)
    ).not.toBeInTheDocument();

    const actions = within(
      screen.getByRole('complementary', { name: 'Supply creation actions' })
    );
    expect(actions.getByRole('button', { name: 'Save draft' })).toBeEnabled();
    expect(
      actions.getByRole('button', { name: 'Finalize supply' })
    ).toBeEnabled();
    await user.click(actions.getByRole('button', { name: 'Review updates' }));
    expect(
      screen.getByRole('dialog', { name: 'Review updates' })
    ).toBeVisible();
    expect(
      screen.queryByRole('dialog', { name: 'Supply changed' })
    ).not.toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Supply number' })).toHaveValue(
      'SUP-009'
    );

    getSupplyMock.mockResolvedValue({
      ok: true,
      data: { ...latest, version: 3 },
    });
    await act(() =>
      queryClient.invalidateQueries({ queryKey: suppliesQueryKeys.detail(9) })
    );
    await user.click(
      within(
        await screen.findByRole('dialog', { name: 'Supply changed' })
      ).getByRole('button', { name: 'Keep editing' })
    );
    expect(screen.getByRole('textbox', { name: 'Comment' })).toHaveValue(
      'My edits continued'
    );
    expect(screen.getByRole('textbox', { name: 'Supply number' })).toHaveValue(
      'SUP-009'
    );
    expect(updateSupplyMock).not.toHaveBeenCalled();
  });

  it('keeps local edits across repeated refreshes and saves against the latest accepted version', async () => {
    getSupplyMock.mockResolvedValue({ ok: true, data: supply });
    const user = userEvent.setup();
    const { queryClient } = setup();
    await user.type(
      await screen.findByRole('textbox', { name: 'Supplier invoice number' }),
      'UNSAVED-INVOICE'
    );
    const refreshedSupply = {
      ...supply,
      supplyNumber: 'SERVER-UPDATE',
      version: 2,
    };
    getSupplyMock.mockResolvedValue({ ok: true, data: refreshedSupply });
    await act(() =>
      queryClient.invalidateQueries({ queryKey: suppliesQueryKeys.detail(9) })
    );

    await user.click(
      within(
        await screen.findByRole('dialog', { name: 'Supply changed' })
      ).getByRole('button', { name: 'Review updates' })
    );
    await user.click(screen.getByRole('button', { name: 'Apply changes' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Supply number' })).toHaveValue(
      'SERVER-UPDATE'
    );
    expect(
      screen.getByRole('textbox', { name: 'Supplier invoice number' })
    ).toHaveValue('UNSAVED-INVOICE');
    expect(
      screen.queryByRole('button', { name: 'Review updates' })
    ).not.toBeInTheDocument();
    expect(updateSupplyMock).not.toHaveBeenCalled();

    const latestSupply = {
      ...refreshedSupply,
      comment: 'Saved elsewhere',
      version: 3,
    };
    getSupplyMock.mockResolvedValue({ ok: true, data: latestSupply });
    await act(() =>
      queryClient.invalidateQueries({ queryKey: suppliesQueryKeys.detail(9) })
    );
    await user.click(
      within(
        await screen.findByRole('dialog', { name: 'Supply changed' })
      ).getByRole('button', { name: 'Review updates' })
    );
    await user.click(screen.getByRole('button', { name: 'Apply changes' }));
    expect(screen.getByRole('textbox', { name: 'Comment' })).toHaveValue(
      'Saved elsewhere'
    );
    expect(
      screen.getByRole('textbox', { name: 'Supplier invoice number' })
    ).toHaveValue('UNSAVED-INVOICE');
    updateSupplyMock.mockResolvedValue({
      ok: true,
      data: {
        ...latestSupply,
        supplierInvoiceNumber: 'UNSAVED-INVOICE',
        version: 4,
      },
    });
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    expect(updateSupplyMock).toHaveBeenCalledExactlyOnceWith({
      supplyId: 9,
      expectedVersion: 3,
      supplierInvoiceNumber: 'UNSAVED-INVOICE',
    });
  });

  it('keeps edits available after dismissing the finalization notice and blocks saving', async () => {
    getSupplyMock.mockResolvedValue({ ok: true, data: supply });
    const user = userEvent.setup();
    const { queryClient } = setup();
    await user.type(
      await screen.findByRole('textbox', { name: 'Comment' }),
      'Unsaved comment'
    );
    getSupplyMock.mockResolvedValue({
      ok: true,
      data: { ...supply, status: SUPPLY_STATUS.COMPLETED, version: 2 },
    });
    await act(() =>
      queryClient.invalidateQueries({ queryKey: suppliesQueryKeys.detail(9) })
    );

    const dialog = await screen.findByRole('dialog', {
      name: 'Supply finalized',
    });
    expect(dialog).toHaveAccessibleDescription(
      'This supply was finalized elsewhere. Your unsaved edits remain on this page, but can no longer be saved.'
    );
    expect(within(dialog).getAllByRole('button')).toHaveLength(1);
    await user.click(within(dialog).getByRole('button', { name: 'Close' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Comment' })).toHaveValue(
      'Unsaved comment'
    );
    expect(screen.getByRole('button', { name: 'Save draft' })).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Finalize supply' })
    ).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    fireEvent.submit(screen.getByRole('form', { name: 'Supply' }));
    expect(updateSupplyMock).not.toHaveBeenCalled();
  });

  it('blocks an already open finalization confirmation when the supply becomes read-only', async () => {
    getSupplyMock.mockResolvedValue({ ok: true, data: supply });
    const user = userEvent.setup();
    const { queryClient } = setup();
    await user.type(
      await screen.findByRole('textbox', { name: 'Comment' }),
      'Unsaved comment'
    );
    await user.click(screen.getByRole('button', { name: 'Finalize supply' }));
    getSupplyMock.mockResolvedValue({
      ok: true,
      data: { ...supply, status: SUPPLY_STATUS.COMPLETED, version: 2 },
    });
    await act(() =>
      queryClient.invalidateQueries({ queryKey: suppliesQueryKeys.detail(9) })
    );
    await user.click(
      within(
        await screen.findByRole('dialog', { name: 'Supply finalized' })
      ).getByRole('button', { name: 'Close' })
    );

    const confirmation = screen.getByRole('dialog', {
      name: 'Finalize supply',
    });
    const finalize = within(confirmation).getByRole('button', {
      name: 'Finalize supply',
    });
    expect(finalize).toBeDisabled();
    await user.click(finalize);
    expect(updateSupplyMock).not.toHaveBeenCalled();
  });

  it.each([
    'local',
    'server',
  ] as const)('resolves conflicts using the %s choice while retaining unrelated edits', async (choice) => {
    getSupplyMock.mockResolvedValue({ ok: true, data: supply });
    const user = userEvent.setup();
    const { queryClient } = setup();
    await user.type(
      await screen.findByRole('textbox', { name: 'Comment' }),
      'My comment'
    );
    await user.type(
      screen.getByRole('textbox', { name: 'Supplier invoice number' }),
      'My invoice'
    );
    await user.clear(screen.getByRole('textbox', { name: 'Supply number' }));
    await user.type(
      screen.getByRole('textbox', { name: 'Supply number' }),
      'MY-NUMBER'
    );
    const latest = {
      ...supply,
      comment: 'Saved comment',
      supplyNumber: 'SAVED-NUMBER',
      version: 2,
    };
    getSupplyMock.mockResolvedValue({ ok: true, data: latest });
    await act(() =>
      queryClient.invalidateQueries({ queryKey: suppliesQueryKeys.detail(9) })
    );
    await user.click(
      within(
        await screen.findByRole('dialog', { name: 'Supply changed' })
      ).getByRole('button', { name: 'Review updates' })
    );

    await user.click(screen.getByRole('button', { name: 'Apply changes' }));
    expect(
      await screen.findAllByText('Choose which value to keep.')
    ).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.getByRole('textbox', { name: 'Comment' })).toHaveValue(
      'My comment'
    );
    await user.click(screen.getByRole('button', { name: 'Review updates' }));
    expect(
      screen.queryByRole('dialog', { name: 'Supply changed' })
    ).not.toBeInTheDocument();
    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Comment' })).getByRole(
        'radio',
        {
          name:
            choice === 'local'
              ? 'Keep my changes: My comment'
              : 'Use saved value: Saved comment',
        }
      )
    );
    await user.click(screen.getByRole('button', { name: 'Apply changes' }));
    expect(
      screen.getByRole('radiogroup', { name: 'Supply number' })
    ).toHaveAccessibleDescription('Choose which value to keep.');
    await user.click(
      within(
        screen.getByRole('radiogroup', { name: 'Supply number' })
      ).getByRole('radio', { name: 'Use saved value: SAVED-NUMBER' })
    );
    await user.click(screen.getByRole('button', { name: 'Apply changes' }));

    const expectedComment = choice === 'local' ? 'My comment' : 'Saved comment';
    expect(screen.getByRole('textbox', { name: 'Comment' })).toHaveValue(
      expectedComment
    );
    expect(
      screen.getByRole('textbox', { name: 'Supplier invoice number' })
    ).toHaveValue('My invoice');
    expect(screen.getByRole('textbox', { name: 'Supply number' })).toHaveValue(
      'SAVED-NUMBER'
    );
    expect(updateSupplyMock).not.toHaveBeenCalled();
    updateSupplyMock.mockResolvedValue({
      ok: true,
      data: {
        ...latest,
        comment: expectedComment,
        supplierInvoiceNumber: 'My invoice',
        version: 3,
      },
    });
    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    expect(updateSupplyMock).toHaveBeenCalledExactlyOnceWith({
      supplyId: 9,
      expectedVersion: 2,
      supplierInvoiceNumber: 'My invoice',
      ...(choice === 'local' ? { comment: 'My comment' } : {}),
    });
  });

  it('requires reviewing new conflicts when the saved version changes during resolution', async () => {
    getSupplyMock.mockResolvedValue({ ok: true, data: supply });
    const user = userEvent.setup();
    const { queryClient } = setup();
    await user.type(
      await screen.findByRole('textbox', { name: 'Comment' }),
      'My comment'
    );
    getSupplyMock.mockResolvedValue({
      ok: true,
      data: { ...supply, comment: 'Server comment', version: 2 },
    });
    await act(() =>
      queryClient.invalidateQueries({ queryKey: suppliesQueryKeys.detail(9) })
    );
    await user.click(
      within(
        await screen.findByRole('dialog', { name: 'Supply changed' })
      ).getByRole('button', { name: 'Review updates' })
    );
    await user.click(
      screen.getByRole('radio', { name: 'Keep my changes: My comment' })
    );
    expect(screen.getByRole('button', { name: 'Apply changes' })).toBeEnabled();
    getSupplyMock.mockResolvedValue({
      ok: true,
      data: { ...supply, comment: 'Newer server comment', version: 3 },
    });

    await act(() =>
      queryClient.invalidateQueries({ queryKey: suppliesQueryKeys.detail(9) })
    );

    expect(
      await screen.findByRole('radio', {
        name: 'Use saved value: Newer server comment',
      })
    ).toBeVisible();
    expect(
      screen.getByRole('radio', { name: 'Keep my changes: My comment' })
    ).not.toBeChecked();
    await user.click(screen.getByRole('button', { name: 'Apply changes' }));
    expect(
      screen.getByRole('radiogroup', { name: 'Comment' })
    ).toHaveAccessibleDescription('Choose which value to keep.');
    await user.click(
      screen.getByRole('radio', { name: 'Keep my changes: My comment' })
    );
    await user.click(screen.getByRole('button', { name: 'Apply changes' }));
    expect(screen.getByRole('textbox', { name: 'Comment' })).toHaveValue(
      'My comment'
    );
    updateSupplyMock.mockResolvedValue({
      ok: true,
      data: { ...supply, comment: 'My comment', version: 4 },
    });
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    expect(updateSupplyMock).toHaveBeenCalledExactlyOnceWith({
      supplyId: 9,
      expectedVersion: 3,
      comment: 'My comment',
    });
  });

  it('preserves unsaved edits when a background refresh fails', async () => {
    getSupplyMock.mockResolvedValue({ ok: true, data: supply });
    const user = userEvent.setup();
    const { queryClient } = setup();
    await user.type(
      await screen.findByRole('textbox', { name: 'Comment' }),
      'Unsaved comment'
    );
    getSupplyMock.mockResolvedValue({
      ok: false,
      error: { status: 500, message: 'Refresh failed' },
    });

    await act(() =>
      queryClient.invalidateQueries({ queryKey: suppliesQueryKeys.detail(9) })
    );

    await user.type(
      screen.getByRole('textbox', { name: 'Comment' }),
      ' after refresh failed'
    );
    expect(screen.getByRole('textbox', { name: 'Comment' })).toHaveValue(
      'Unsaved comment after refresh failed'
    );
    expect(screen.getByRole('button', { name: 'Save draft' })).toBeEnabled();
  });

  it('keeps the chosen product list and unrelated local edits when both product lists changed', async () => {
    getSupplyMock.mockResolvedValue({ ok: true, data: supply });
    const user = userEvent.setup();
    const { queryClient } = setup();
    await user.type(
      await screen.findByRole('textbox', { name: 'Supplier invoice number' }),
      'My invoice'
    );
    await user.clear(
      screen.getByRole('spinbutton', { name: 'Quantity for row 1' })
    );
    await user.type(
      screen.getByRole('spinbutton', { name: 'Quantity for row 1' }),
      '3'
    );
    const latest = {
      ...supply,
      supplyEntries: [{ ...supply.supplyEntries[0], id: 20, unitPrice: 6 }],
      version: 2,
    };
    getSupplyMock.mockResolvedValue({ ok: true, data: latest });
    await act(() =>
      queryClient.invalidateQueries({ queryKey: suppliesQueryKeys.detail(9) })
    );

    await user.click(
      within(
        await screen.findByRole('dialog', { name: 'Supply changed' })
      ).getByRole('button', { name: 'Review updates' })
    );
    const products = screen.getByRole('radiogroup', {
      name: 'Supply products',
    });
    expect(products).toHaveAccessibleDescription(
      'Choose the complete product list to keep.'
    );
    await user.click(screen.getByRole('button', { name: 'Apply changes' }));
    expect(products).toHaveAccessibleDescription('Choose which value to keep.');
    await user.click(
      within(products).getByRole('radio', {
        name: /Keep my changes:.*quantity: 3/,
      })
    );
    expect(products).toHaveAccessibleDescription(
      'Choose the complete product list to keep.'
    );
    await user.click(screen.getByRole('button', { name: 'Apply changes' }));

    expect(
      screen.getByRole('spinbutton', { name: 'Quantity for row 1' })
    ).toHaveValue(3);
    expect(
      screen.getByRole('textbox', { name: 'Supplier invoice number' })
    ).toHaveValue('My invoice');
    updateSupplyMock.mockResolvedValue({
      ok: true,
      data: { ...latest, version: 3 },
    });
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    expect(updateSupplyMock).toHaveBeenCalledExactlyOnceWith({
      supplyId: 9,
      expectedVersion: 2,
      supplierInvoiceNumber: 'My invoice',
      supplyEntries: [
        {
          productVariantId: 11,
          unitOfMeasurementId: 3,
          quantity: 3,
          unitPrice: 5,
          comment: null,
        },
      ],
    });
  });

  it('prevents editing and row deletion until saving and its workflow finish', async () => {
    getSupplyMock.mockResolvedValue({ ok: true, data: supply });
    const response =
      Promise.withResolvers<Awaited<ReturnType<typeof updateSupply>>>();
    const invalidation = Promise.withResolvers<void>();
    updateSupplyMock.mockReturnValue(response.promise);
    const user = userEvent.setup();
    const { queryClient } = setup();
    vi.spyOn(queryClient, 'invalidateQueries').mockReturnValue(
      invalidation.promise
    );
    await user.type(
      await screen.findByRole('textbox', { name: 'Supplier invoice number' }),
      'INV-1'
    );
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    await waitFor(() => expect(updateSupplyMock).toHaveBeenCalled());

    for (const input of [
      ...screen.getAllByRole('textbox'),
      ...screen.getAllByRole('combobox'),
      ...screen.getAllByRole('spinbutton'),
    ]) {
      expect(input).toBeDisabled();
    }
    expect(
      screen.getByRole('button', { name: '+ Add another product' })
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Actions for Rice' })
    ).toBeDisabled();
    await user.type(
      screen.getByRole('textbox', { name: 'Comment' }),
      'Entered during save'
    );
    await user.click(screen.getByRole('checkbox', { name: 'Select Rice' }));
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(
      screen.getByRole('combobox', { name: 'Product for row 1' })
    ).toHaveValue('Rice');

    await act(() =>
      response.resolve({
        ok: true,
        data: { ...supply, supplierInvoiceNumber: 'INV-1', version: 2 },
      })
    );
    expect(screen.getByRole('textbox', { name: 'Comment' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'Comment' })).toHaveValue('');
    await act(() => invalidation.resolve());

    expect(screen.getByRole('textbox', { name: 'Comment' })).toBeEnabled();
    await user.type(
      screen.getByRole('textbox', { name: 'Comment' }),
      'Entered after save'
    );
    expect(screen.getByRole('textbox', { name: 'Comment' })).toHaveValue(
      'Entered after save'
    );
  });

  it('preserves added product rows when a newer supply arrives', async () => {
    getSupplyMock.mockResolvedValue({ ok: true, data: supply });
    const user = userEvent.setup();
    const { queryClient } = setup();
    await user.click(
      await screen.findByRole('button', { name: '+ Add another product' })
    );
    getSupplyMock.mockResolvedValue({
      ok: true,
      data: { ...supply, supplyNumber: 'SERVER-UPDATE', version: 2 },
    });

    await act(() =>
      queryClient.invalidateQueries({ queryKey: suppliesQueryKeys.detail(9) })
    );

    await user.click(
      within(
        await screen.findByRole('dialog', { name: 'Supply changed' })
      ).getByRole('button', { name: 'Review updates' })
    );
    await user.click(screen.getByRole('button', { name: 'Apply changes' }));
    expect(
      screen.getByRole('combobox', { name: 'Product for row 2' })
    ).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Supply number' })).toHaveValue(
      'SERVER-UPDATE'
    );
  });

  it('keeps unsaved rows after the latest saved rows across repeated refreshes', async () => {
    getSupplyMock.mockResolvedValue({ ok: true, data: supply });
    const user = userEvent.setup();
    const { queryClient } = setup();
    await user.click(
      await screen.findByRole('button', { name: '+ Add another product' })
    );
    await user.type(
      screen.getByRole('spinbutton', { name: 'Quantity for row 2' }),
      '7'
    );
    await user.type(
      screen.getByRole('textbox', { name: 'Comment for row 2' }),
      'My unfinished row'
    );
    const latest = {
      ...supply,
      supplyEntries: [
        { ...supply.supplyEntries[0], id: 20, quantity: 4 },
        {
          ...supply.supplyEntries[0],
          id: 21,
          productVariant: { id: 12, name: 'Beans' },
          quantity: 6,
        },
      ],
      version: 2,
    };
    getSupplyMock.mockResolvedValue({ ok: true, data: latest });
    await act(() =>
      queryClient.invalidateQueries({ queryKey: suppliesQueryKeys.detail(9) })
    );

    await user.click(
      within(
        await screen.findByRole('dialog', { name: 'Supply changed' })
      ).getByRole('button', { name: 'Review updates' })
    );
    await user.click(screen.getByRole('button', { name: 'Apply changes' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Product for row 1' })
    ).toHaveValue('Rice');
    expect(
      screen.getByRole('spinbutton', { name: 'Quantity for row 1' })
    ).toHaveValue(4);
    expect(
      screen.getByRole('combobox', { name: 'Product for row 2' })
    ).toHaveValue('Beans');
    expect(
      screen.getByRole('spinbutton', { name: 'Quantity for row 2' })
    ).toHaveValue(6);
    expect(
      screen.getByRole('spinbutton', { name: 'Quantity for row 3' })
    ).toHaveValue(7);
    expect(
      screen.getByRole('textbox', { name: 'Comment for row 3' })
    ).toHaveValue('My unfinished row');

    getSupplyMock.mockResolvedValue({
      ok: true,
      data: {
        ...latest,
        supplyEntries: [{ ...latest.supplyEntries[1], id: 30, quantity: 8 }],
        version: 3,
      },
    });
    await act(() =>
      queryClient.invalidateQueries({ queryKey: suppliesQueryKeys.detail(9) })
    );
    await user.click(
      within(
        await screen.findByRole('dialog', { name: 'Supply changed' })
      ).getByRole('button', { name: 'Review updates' })
    );
    await user.click(screen.getByRole('button', { name: 'Apply changes' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Product for row 1' })
    ).toHaveValue('Beans');
    expect(
      screen.getByRole('spinbutton', { name: 'Quantity for row 1' })
    ).toHaveValue(8);
    expect(
      screen.getByRole('spinbutton', { name: 'Quantity for row 2' })
    ).toHaveValue(7);
    expect(
      screen.getByRole('textbox', { name: 'Comment for row 2' })
    ).toHaveValue('My unfinished row');
    expect(
      screen.queryByRole('combobox', { name: 'Product for row 3' })
    ).not.toBeInTheDocument();
    expect(updateSupplyMock).not.toHaveBeenCalled();
  });

  it('shows a supply completed elsewhere as read-only when there are no local edits', async () => {
    getSupplyMock.mockResolvedValue({ ok: true, data: supply });
    const { queryClient } = setup();
    await screen.findByRole('textbox', { name: 'Supply number' });
    getSupplyMock.mockResolvedValue({
      ok: true,
      data: { ...supply, status: SUPPLY_STATUS.COMPLETED, version: 2 },
    });

    await act(() =>
      queryClient.invalidateQueries({ queryKey: suppliesQueryKeys.detail(9) })
    );

    expect(await screen.findByText('Completed')).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Save draft' })
    ).not.toBeInTheDocument();
  });

  it('keeps a newer server version when an earlier save response arrives afterwards', async () => {
    getSupplyMock.mockResolvedValue({ ok: true, data: supply });
    const response =
      Promise.withResolvers<Awaited<ReturnType<typeof updateSupply>>>();
    updateSupplyMock.mockReturnValue(response.promise);
    const user = userEvent.setup();
    const { queryClient } = setup();
    await user.type(
      await screen.findByRole('textbox', { name: 'Supplier invoice number' }),
      'INV-1'
    );
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    await waitFor(() => expect(updateSupplyMock).toHaveBeenCalled());
    const savedSupply = {
      ...supply,
      supplierInvoiceNumber: 'INV-1',
      version: 2,
    };
    const latestSupply = { ...savedSupply, supplyNumber: 'LATEST', version: 3 };
    getSupplyMock.mockResolvedValue({ ok: true, data: latestSupply });
    await act(() =>
      queryClient.invalidateQueries({ queryKey: suppliesQueryKeys.detail(9) })
    );

    await act(() => response.resolve({ ok: true, data: savedSupply }));

    await waitFor(() =>
      expect(
        screen.getByRole('textbox', { name: 'Supply number' })
      ).toHaveValue('LATEST')
    );
    updateSupplyMock.mockResolvedValue({
      ok: true,
      data: { ...latestSupply, comment: 'Next edit', version: 4 },
    });
    await user.type(
      screen.getByRole('textbox', { name: 'Comment' }),
      'Next edit'
    );
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    expect(updateSupplyMock).toHaveBeenLastCalledWith({
      supplyId: 9,
      expectedVersion: 3,
      comment: 'Next edit',
    });
  });
});
