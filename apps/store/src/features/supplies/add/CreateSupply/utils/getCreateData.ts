import type { CreateSupplyData } from '@/lib/client/api/supplies';
import type { SupplyStatus } from '@/lib/domain/supplies/types';
import type { SupplyFormValues } from '../../../shared/SupplyEditorForm';
import {
  getSupplyEntriesPayload,
  normalizeOptionalText,
} from '../../../shared/SupplyEditorForm';

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
    supplierId: Number(value.supplier?.id),
    warehouseId: Number(value.warehouse?.id),
    supplyNumber: value.supplyNumber.trim(),
    status,
    supplyEntries,
    ...(supplierInvoiceNumber ? { supplierInvoiceNumber } : {}),
    ...(comment ? { comment } : {}),
  };
};
