import type { TransferDetails } from '@/lib/domain/transfers/types';
import {
  getTransferFormDefaults,
  useSubmitTransferForm,
} from '../../../shared/TransferEditorForm';
import { getTransferUpdateChanges } from '../utils/getUpdateChanges';
import { submitUpdateTransfer } from '../utils/submitAction';

type UseUpdateTransferFormArgs = {
  transfer: TransferDetails;
  onUpdated: (transfer: TransferDetails) => Promise<void> | void;
};

export const useUpdateTransferForm = ({
  transfer,
  onUpdated,
}: UseUpdateTransferFormArgs) =>
  useSubmitTransferForm({
    defaultValues: getTransferFormDefaults(transfer),
    draftSuccessMessage: 'Transfer draft saved.',
    submitAction: async ({ value, status }) => {
      const changes = getTransferUpdateChanges({
        transfer,
        formValue: value,
        status,
      });

      if (!changes) {
        return null;
      }

      return submitUpdateTransfer({
        transferId: transfer.id,
        expectedVersion: transfer.version,
        submitData: changes,
      });
    },
    onSaved: onUpdated,
  });
