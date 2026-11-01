import {
  type UpdateAttributeFieldData,
  updateAttribute,
} from '@/lib/client/api/attributes';
import { getApiErrorMessage } from '@/lib/utils/apiError';
import { getChangedValues } from '@/lib/utils/form/comparison/getChangedValues';
import type { UpdateAttributeFormValues } from './validations';

type SubmitUpdateAttributeArgs = {
  attributeId: string | number;
  submitData: UpdateAttributeFieldData;
};

type GetAttributeUpdateChangesArgs = {
  formValue: UpdateAttributeFormValues;
  initialName: string;
};

const normalizeUpdateAttributeFormData = (data: UpdateAttributeFormValues) => ({
  name: data.name.trim(),
});

export const getAttributeUpdateChanges = ({
  formValue,
  initialName,
}: GetAttributeUpdateChangesArgs) =>
  getChangedValues({
    initialData: normalizeUpdateAttributeFormData({ name: initialName }),
    submitData: normalizeUpdateAttributeFormData(formValue),
  });

export const submitUpdateAttribute = async ({
  attributeId,
  submitData,
}: SubmitUpdateAttributeArgs) => {
  const result = await updateAttribute({
    attributeId,
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
