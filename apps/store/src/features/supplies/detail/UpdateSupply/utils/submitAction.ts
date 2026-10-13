import {
  type UpdateSupplyData,
  type UpdateSupplyFieldData,
  updateSupply,
} from '@/lib/client/api/supplies';

type SubmitUpdateSupplyArgs = {
  supplyId: UpdateSupplyData['supplyId'];
  expectedVersion: UpdateSupplyData['expectedVersion'];
  submitData: UpdateSupplyFieldData;
};

export const submitUpdateSupply = ({
  supplyId,
  expectedVersion,
  submitData,
}: SubmitUpdateSupplyArgs) =>
  updateSupply({
    ...submitData,
    supplyId,
    expectedVersion,
  });
