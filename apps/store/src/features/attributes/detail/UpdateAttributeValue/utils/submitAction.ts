import { updateAttributeValue } from '@/lib/client/api/attributes';
import { getApiErrorMessage } from '@/lib/utils/apiError';
import type { UpdateAttributeValueFormValues } from './validations';

type SubmitUpdateAttributeValueArgs = {
  attributeValueId: string | number;
  value: UpdateAttributeValueFormValues;
};

export const submitUpdateAttributeValue = async ({
  attributeValueId,
  value,
}: SubmitUpdateAttributeValueArgs) => {
  const result = await updateAttributeValue({
    attributeValueId,
    name: value.name.trim(),
    sortOrder: value.sortOrder,
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
