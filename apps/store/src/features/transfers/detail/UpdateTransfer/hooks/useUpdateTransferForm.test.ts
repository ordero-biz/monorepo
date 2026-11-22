import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import type { TransferDetails } from '@/lib/domain/transfers/types';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { prepareFormHookTestSetup } from '@/test/prepareFormHookTestSetup';
import type { TransferSubmitIntent } from '../../../shared/TransferEditorForm';
import { submitUpdateTransfer } from '../utils/submitAction';
import { useUpdateTransferForm } from './useUpdateTransferForm';

vi.mock('../utils/submitAction', async () => ({
  ...(await vi.importActual<typeof import('../utils/submitAction')>(
    '../utils/submitAction'
  )),
  submitUpdateTransfer: vi.fn(),
}));

const submitUpdateTransferMock = vi.mocked(submitUpdateTransfer);

const transfer: TransferDetails = {
  id: 5,
  sourceWarehouse: {
    id: 1,
    name: 'Main Warehouse',
    status: WAREHOUSE_STATUS.ACTIVE,
  },
  destinationWarehouse: {
    id: 2,
    name: 'East Warehouse',
    status: WAREHOUSE_STATUS.ACTIVE,
  },
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

type TestHookProps = Parameters<typeof useUpdateTransferForm>[0] & {
  intent: TransferSubmitIntent;
  transferNumber: string;
};

const useTestTransferForm = ({
  intent,
  transferNumber,
  ...args
}: TestHookProps) => {
  const { form, submit } = useUpdateTransferForm(args);
  return {
    form: {
      handleSubmit: () => {
        form.setFieldValue('transferNumber', transferNumber);
        return submit(intent);
      },
    },
  };
};

const { setup } = prepareFormHookTestSetup<TestHookProps>({
  useFormHook: useTestTransferForm,
  hookProps: {
    transfer,
    intent: 'draft',
    transferNumber: 'Monday restock',
    onUpdated: vi.fn(),
  },
});

describe('useUpdateTransferForm', () => {
  beforeEach(() => {
    submitUpdateTransferMock.mockReset();
  });

  it('saves a metadata-only draft and reports the saved transfer', async () => {
    const savedTransfer = {
      ...transfer,
      transferNumber: 'Monday restock',
      version: 2,
    };
    submitUpdateTransferMock.mockResolvedValue({
      ok: true,
      data: savedTransfer,
    });
    const user = userEvent.setup();
    const { hookProps } = setup({
      hookProps: {
        transfer,
        intent: 'draft',
        transferNumber: 'Monday restock',
        onUpdated: vi.fn(),
      },
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() =>
      expect(hookProps.onUpdated).toHaveBeenCalledWith(savedTransfer)
    );
    expect(submitUpdateTransferMock).toHaveBeenCalledWith({
      transferId: transfer.id,
      expectedVersion: transfer.version,
      submitData: { transferNumber: 'Monday restock' },
    });
  });

  it('rejects an empty transfer and then allows saving the same form as a draft', async () => {
    const user = userEvent.setup();
    const { hookProps, renderResult } = setup({
      hookProps: {
        transfer,
        intent: 'transfer',
        transferNumber: 'Monday restock',
        onUpdated: vi.fn(),
      },
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(
      await screen.findByText('Add at least one product before transferring.')
    ).toBeVisible();
    expect(submitUpdateTransferMock).not.toHaveBeenCalled();
    expect(hookProps.onUpdated).not.toHaveBeenCalled();

    const savedTransfer = {
      ...transfer,
      transferNumber: 'Monday restock',
      version: 2,
    };
    submitUpdateTransferMock.mockResolvedValue({
      ok: true,
      data: savedTransfer,
    });
    renderResult.rerender({ hookProps: { ...hookProps, intent: 'draft' } });
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() =>
      expect(hookProps.onUpdated).toHaveBeenCalledWith(savedTransfer)
    );
    expect(submitUpdateTransferMock).toHaveBeenCalledExactlyOnceWith({
      transferId: transfer.id,
      expectedVersion: transfer.version,
      submitData: { transferNumber: 'Monday restock' },
    });
  });

  it('skips submission and reports no changes for an unchanged draft', async () => {
    const user = userEvent.setup();
    const { hookProps } = setup({
      hookProps: {
        transfer,
        intent: 'draft',
        transferNumber: ' Weekend restock ',
        onUpdated: vi.fn(),
      },
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('No changes to save.')).toBeVisible();
    expect(submitUpdateTransferMock).not.toHaveBeenCalled();
    expect(hookProps.onUpdated).not.toHaveBeenCalled();
  });

  it('shows a submit error without reporting success', async () => {
    submitUpdateTransferMock.mockResolvedValue({
      ok: false,
      error: { status: 500, message: 'Could not save the transfer.' },
    });
    const user = userEvent.setup();
    const { hookProps } = setup({
      hookProps: {
        transfer,
        intent: 'draft',
        transferNumber: 'Monday restock',
        onUpdated: vi.fn(),
      },
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(
      await screen.findByText('Could not save the transfer.')
    ).toBeVisible();
    expect(hookProps.onUpdated).not.toHaveBeenCalled();
  });
});
