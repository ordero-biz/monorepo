import {
  type UpdateWarehouseFieldData,
  updateWarehouse,
} from '@/lib/client/api/warehouses';
import type { Warehouse } from '@/lib/domain/warehouses';
import { getChangedValues } from '@/lib/utils/form/comparison/getChangedValues';
import type { WarehouseFormValues } from '../../../shared/validations';
import { getWarehouseDefaultValues } from './fields';

type SubmitUpdateWarehouseArgs = {
  warehouseId: string | number;
  submitData: UpdateWarehouseFieldData;
};

type GetWarehouseUpdateChangesArgs = {
  formValue: WarehouseFormValues;
  warehouse: Warehouse;
};

const normalizeUpdateWarehouseFormData = (data: WarehouseFormValues) => ({
  name: data.name.trim(),
  address: data.address.trim(),
  comment: data.comment.trim(),
});

export const getWarehouseUpdateChanges = ({
  formValue,
  warehouse,
}: GetWarehouseUpdateChangesArgs) =>
  getChangedValues({
    initialData: normalizeUpdateWarehouseFormData(
      getWarehouseDefaultValues(warehouse)
    ),
    submitData: normalizeUpdateWarehouseFormData(formValue),
  });

export const submitUpdateWarehouse = async ({
  warehouseId,
  submitData,
}: SubmitUpdateWarehouseArgs) => {
  const result = await updateWarehouse({
    warehouseId,
    ...submitData,
  });

  if (!result.ok) {
    return {
      ok: false,
      error: {
        fieldErrors: result.error.fieldErrors,
        formError: result.error.message,
      },
    } as const;
  }

  return {
    ok: true,
    data: result.data,
  } as const;
};
