import type { UpdateWarehouseFieldData } from '@/lib/client/api/warehouses';
import type { Warehouse } from '@/lib/domain/warehouses/types';
import { getChangedValues } from '@/lib/utils/form/comparison/getChangedValues';
import type { WarehouseFormValues } from '../../../shared/validations';
import { getWarehouseDefaultValues } from './fields';

type GetWarehouseUpdateChangesArgs = {
  formValue: WarehouseFormValues;
  warehouse: Warehouse;
};

const normalizeUpdateWarehouseFormData = (data: WarehouseFormValues) => ({
  name: data.name.trim(),
  address: data.address?.trim() || null,
  comment: data.comment.trim(),
});

export const getWarehouseUpdateChanges = ({
  formValue,
  warehouse,
}: GetWarehouseUpdateChangesArgs): UpdateWarehouseFieldData | undefined =>
  getChangedValues({
    initialData: normalizeUpdateWarehouseFormData(
      getWarehouseDefaultValues(warehouse)
    ),
    submitData: normalizeUpdateWarehouseFormData(formValue),
  });
