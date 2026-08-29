import type { Supplier } from '@/lib/domain/suppliers/types';
import { getChangedValues } from '@/lib/utils/form/comparison/getChangedValues';
import { getSupplierDefaultValues } from './fields';
import type { UpdateSupplierFormValues } from './validations';

type GetUpdateChangesArgs = {
  formValue: UpdateSupplierFormValues;
  supplier: Supplier;
};

const normalizeUpdateSupplierFormData = (data: UpdateSupplierFormValues) => ({
  name: data.name.trim(),
  email: data.email?.trim() || null,
  phone: data.phone?.trim() || null,
  address: data.address?.trim() || null,
  comment: data.comment?.trim() || null,
});

export const getSupplierUpdateChanges = ({
  formValue,
  supplier,
}: GetUpdateChangesArgs) =>
  getChangedValues({
    initialData: normalizeUpdateSupplierFormData(
      getSupplierDefaultValues(supplier)
    ),
    submitData: normalizeUpdateSupplierFormData(formValue),
  });
