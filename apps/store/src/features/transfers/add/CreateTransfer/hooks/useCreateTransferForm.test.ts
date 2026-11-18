import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import type { TransferDetails } from '@/lib/domain/transfers/types';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { prepareFormHookTestSetup } from '@/test/prepareFormHookTestSetup';
import type { TransferFormValues, TransferSubmitIntent } from '../types';
import { createEmptyTransferEntry } from '../utils/entries';
import { getTransferFormDefaults } from '../utils/getTransferFormDefaults';
import { submitCreateTransfer } from '../utils/submitAction';
import { useCreateTransferForm } from './useCreateTransferForm';

vi.mock('../utils/submitAction', async () => ({
  ...(await vi.importActual<typeof import('../utils/submitAction')>(
    '../utils/submitAction'
  )),
  submitCreateTransfer: vi.fn(),
}));

const submitCreateTransferMock = vi.mocked(submitCreateTransfer);

const warehouse = (id: number, name: string) => ({
  id,
  name,
  status: WAREHOUSE_STATUS.ACTIVE,
});

const transfer: TransferDetails = {
  id: 5,
  sourceWarehouse: warehouse(1, 'Main Warehouse'),
  destinationWarehouse: warehouse(2, 'East Warehouse'),
  transferNumber: 'Weekend restock',
  status: TRANSFER_STATUS.DRAFT,
  comment: null,
  dispatchedAt: null,
  dispatchedBy: null,
  completedAt: null,
  completedBy: null,
  createdAt: '2026-11-17T10:00:00Z',
  createdBy: 'owner@example.test',
  updatedAt: '2026-11-17T10:00:00Z',
  updatedBy: 'owner@example.test',
  transferEntries: [],
  version: 1,
};

const filledValues: TransferFormValues = {
  transferNumber: ' Weekend restock ',
  sourceWarehouse: warehouse(1, 'Main Warehouse'),
  destinationWarehouse: warehouse(2, 'East Warehouse'),
  comment: '   ',
  transferEntries: [
    {
      clientId: 'row-1',
      stockItem: {
        productVariant: { id: 11, name: 'Rice', sku: 'GR-1' },
        unitOfMeasurement: { id: 4, name: 'Bag', symbol: 'bag' },
        available: 120,
      },
      quantity: 5,
      comment: '',
    },
    createEmptyTransferEntry('row-2'),
  ],
};

type TestHookProps = Parameters<typeof useCreateTransferForm>[0] & {
  intent: TransferSubmitIntent;
};

const useTestCreateTransferForm = ({ intent, ...args }: TestHookProps) => {
  const { submit } = useCreateTransferForm(args);
  return { form: { handleSubmit: () => submit(intent) } };
};

const { setup } = prepareFormHookTestSetup<TestHookProps>({
  useFormHook: useTestCreateTransferForm,
  hookProps: {
    defaultValues: filledValues,
    intent: 'draft',
    onCreated: vi.fn(),
  },
});

describe('useCreateTransferForm', () => {
  beforeEach(() => {
    submitCreateTransferMock.mockReset();
  });

  it.each([
    ['draft', TRANSFER_STATUS.DRAFT, 'Transfer draft created.'],
    [
      'transfer',
      TRANSFER_STATUS.IN_TRANSIT,
      'Transfer started. Products are in transit.',
    ],
  ] as const)('creates a transfer with %s intent and reports the result', async (intent, status, message) => {
    const savedTransfer = { ...transfer, status };
    submitCreateTransferMock.mockResolvedValue({
      ok: true,
      data: savedTransfer,
    });
    const user = userEvent.setup();
    const { hookProps } = setup({
      hookProps: { defaultValues: filledValues, intent, onCreated: vi.fn() },
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() =>
      expect(hookProps.onCreated).toHaveBeenCalledWith(savedTransfer)
    );
    expect(submitCreateTransferMock).toHaveBeenCalledWith({
      sourceWarehouseId: 1,
      destinationWarehouseId: 2,
      transferNumber: 'Weekend restock',
      status,
      transferEntries: [
        { productVariantId: 11, unitOfMeasurementId: 4, quantity: 5 },
      ],
    });
    expect(await screen.findByText(message)).toBeVisible();
  });

  it('rejects a transfer without products', async () => {
    const user = userEvent.setup();
    const { hookProps } = setup({
      hookProps: {
        onCreated: vi.fn(),
        defaultValues: {
          ...filledValues,
          transferEntries: getTransferFormDefaults().transferEntries,
        },
        intent: 'transfer',
      },
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(
      await screen.findByText('Add at least one product before transferring.')
    ).toBeVisible();
    expect(submitCreateTransferMock).not.toHaveBeenCalled();
    expect(hookProps.onCreated).not.toHaveBeenCalled();
  });

  it('does not report creation when the submit action fails', async () => {
    submitCreateTransferMock.mockResolvedValue({
      ok: false,
      error: { status: 500, message: 'Could not save the transfer.' },
    });
    const user = userEvent.setup();
    const { hookProps } = setup({
      hookProps: {
        defaultValues: filledValues,
        intent: 'draft',
        onCreated: vi.fn(),
      },
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(
      await screen.findByText('Could not save the transfer.')
    ).toBeVisible();
    expect(hookProps.onCreated).not.toHaveBeenCalled();
  });
});
