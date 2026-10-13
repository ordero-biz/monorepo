import type { UpdateSupplyFieldData } from '@/lib/client/api/supplies';
import type { SupplyDetails, SupplyStatus } from '@/lib/domain/supplies/types';
import { getChangedValues } from '@/lib/utils/form/comparison/getChangedValues';
import {
  getSupplyEntriesPayload,
  getSupplyFormDefaults,
  normalizeOptionalText,
  type SupplyFormValues,
} from '../../../shared/SupplyEditorForm';

type GetSupplyUpdateChangesArgs = {
  supply: SupplyDetails;
  formValue: SupplyFormValues;
  status: SupplyStatus;
};

const normalizeUpdateSupplyFormData = (
  value: SupplyFormValues,
  status: SupplyStatus
) => ({
  supplierId: Number(value.supplierId),
  warehouseId: Number(value.warehouseId),
  supplyNumber: value.supplyNumber.trim(),
  supplierInvoiceNumber: normalizeOptionalText(value.supplierInvoiceNumber),
  comment: normalizeOptionalText(value.comment),
  supplyEntries: getSupplyEntriesPayload(value).map((entry) => ({
    ...entry,
    // Object.is distinguishes -0 from 0, but both represent the same price.
    unitPrice: entry.unitPrice === 0 ? 0 : entry.unitPrice,
  })),
  status,
});

export const getSupplyUpdateChanges = ({
  supply,
  formValue,
  status,
}: GetSupplyUpdateChangesArgs): UpdateSupplyFieldData | undefined =>
  getChangedValues({
    initialData: normalizeUpdateSupplyFormData(
      getSupplyFormDefaults(supply),
      supply.status
    ),
    submitData: normalizeUpdateSupplyFormData(formValue, status),
  });
