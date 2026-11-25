import {
  type UpdateAttributeValueFieldData,
  updateAttributeValue,
} from '@/lib/client/api/attributes';
import { getApiErrorMessage } from '@/lib/utils/apiError';
import { getChangedValues } from '@/lib/utils/form/comparison/getChangedValues';
import type { UpdateAttributeValueFormValues } from './validations';

type SubmitUpdateAttributeValueArgs = {
  attributeValueId: string | number;
  submitData: UpdateAttributeValueFieldData;
};

type GetAttributeValueUpdateChangesArgs = {
  formValue: UpdateAttributeValueFormValues;
  initialName: string;
  initialSortOrder: number;
};

const normalizeUpdateAttributeValueFormData = (
  data: UpdateAttributeValueFormValues
) => ({
  name: data.name.trim(),
  sortOrder: data.sortOrder,
});

export const getAttributeValueUpdateChanges = ({
  formValue,
  initialName,
  initialSortOrder,
}: GetAttributeValueUpdateChangesArgs) =>
  getChangedValues({
    initialData: normalizeUpdateAttributeValueFormData({
      name: initialName,
      sortOrder: initialSortOrder,
    }),
    submitData: normalizeUpdateAttributeValueFormData(formValue),
  });

export const submitUpdateAttributeValue = async ({
  attributeValueId,
  submitData,
}: SubmitUpdateAttributeValueArgs) => {
  const result = await updateAttributeValue({
    attributeValueId,
    ...submitData,
  });

  if (!result.ok) {
    return {
      ok: false,
      error: {
        fieldErrors: result.error.fieldErrors,
        formError: getApiErrorMessage(result.error),
      },
    } as const;
  }

  return {
    ok: true,
    data: result.data,
  } as const;
};
