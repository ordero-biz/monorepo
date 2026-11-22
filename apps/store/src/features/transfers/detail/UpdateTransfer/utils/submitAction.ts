import {
  type UpdateTransferData,
  type UpdateTransferFieldData,
  updateTransfer,
} from '@/lib/client/api/transfers';

type SubmitUpdateTransferArgs = {
  transferId: UpdateTransferData['transferId'];
  expectedVersion: UpdateTransferData['expectedVersion'];
  submitData: UpdateTransferFieldData;
};

export const submitUpdateTransfer = ({
  transferId,
  expectedVersion,
  submitData,
}: SubmitUpdateTransferArgs) =>
  updateTransfer({
    ...submitData,
    transferId,
    expectedVersion,
  });
