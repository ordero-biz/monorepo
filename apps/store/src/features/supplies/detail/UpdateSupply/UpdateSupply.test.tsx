import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { updateSupply } from '@/lib/client/api/supplies';
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
