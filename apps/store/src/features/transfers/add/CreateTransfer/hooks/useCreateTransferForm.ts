import type { TransferDetails } from '@/lib/domain/transfers/types';
import {
  type TransferFormValues,
  useSubmitTransferForm,
} from '../../../shared/TransferEditorForm';
import { getCreateTransferData } from '../utils/getCreateData';
import { submitCreateTransfer } from '../utils/submitAction';

type UseCreateTransferFormArgs = {
  defaultValues: TransferFormValues;
  onCreated: (transfer: TransferDetails) => Promise<void> | void;
};

export const useCreateTransferForm = ({
  defaultValues,
  onCreated,
}: UseCreateTransferFormArgs) =>
  useSubmitTransferForm({
    defaultValues,
    draftSuccessMessage: 'Transfer draft created.',
    submitAction: ({ value, status }) =>
      submitCreateTransfer(getCreateTransferData(value, status)),
    onSaved: onCreated,
  });
