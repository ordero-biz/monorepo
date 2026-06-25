import { updateAttributeValue } from '@/lib/client/api/attributes';
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
        formError: result.error.message,
      },
    } as const;
  }

  return {
    ok: true,
    data: result.data,
  } as const;
};
