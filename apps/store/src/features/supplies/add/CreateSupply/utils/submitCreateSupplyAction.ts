import { type CreateSupplyData, createSupply } from '@/lib/client/api/supplies';
import type { SupplyStatus } from '@/lib/domain/supplies/types';
import type { SupplyFormValues } from '../../../shared/SupplyEditorForm';
import {
  getSupplyEntriesPayload,
  normalizeOptionalText,
} from '../../../shared/SupplyEditorForm';

type SubmitCreateSupplyActionArgs = {
  value: SupplyFormValues;
  status: SupplyStatus;
};

export const getCreateSupplyData = (
  value: SupplyFormValues,
  status: SupplyStatus
): CreateSupplyData => {
  const supplierInvoiceNumber = normalizeOptionalText(
    value.supplierInvoiceNumber
  );
  const comment = normalizeOptionalText(value.comment);
  const supplyEntries = getSupplyEntriesPayload(value).map(
    ({ comment: entryComment, ...entry }) =>
      entryComment ? { ...entry, comment: entryComment } : entry
  );

  return {
    supplierId: Number(value.supplierId),
    warehouseId: Number(value.warehouseId),
    supplyNumber: value.supplyNumber.trim(),
    status,
    supplyEntries,
    ...(supplierInvoiceNumber ? { supplierInvoiceNumber } : {}),
    ...(comment ? { comment } : {}),
  };
};

export const submitCreateSupplyAction = ({
  value,
  status,
}: SubmitCreateSupplyActionArgs) =>
  createSupply(getCreateSupplyData(value, status));
