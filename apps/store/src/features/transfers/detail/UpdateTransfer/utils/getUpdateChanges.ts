import type { UpdateTransferFieldData } from '@/lib/client/api/transfers';
import type {
  TransferDetails,
  TransferStatus,
} from '@/lib/domain/transfers/types';
import { getChangedValues } from '@/lib/utils/form/comparison/getChangedValues';
import { normalizeOptionalText } from '@/lib/utils/form/normalizeOptionalText';
import {
  getTransferEntriesPayload,
  getTransferFormDefaults,
  type TransferFormValues,
} from '../../../shared/TransferEditorForm';

type GetTransferUpdateChangesArgs = {
  transfer: TransferDetails;
  formValue: TransferFormValues;
  status: TransferStatus;
};

const normalizeUpdateTransferFormData = (
  value: TransferFormValues,
  status: TransferStatus
) => ({
  sourceWarehouseId: Number(value.sourceWarehouse?.id),
  destinationWarehouseId: Number(value.destinationWarehouse?.id),
  transferNumber: value.transferNumber.trim(),
  comment: normalizeOptionalText(value.comment),
  transferEntries: getTransferEntriesPayload(value),
  status,
});

export const getTransferUpdateChanges = ({
  transfer,
  formValue,
  status,
}: GetTransferUpdateChangesArgs): UpdateTransferFieldData | undefined =>
  getChangedValues({
    initialData: normalizeUpdateTransferFormData(
      getTransferFormDefaults(transfer),
      transfer.status
    ),
    submitData: normalizeUpdateTransferFormData(formValue, status),
  });
