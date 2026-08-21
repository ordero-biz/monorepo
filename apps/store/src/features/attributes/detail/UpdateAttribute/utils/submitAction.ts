import { updateAttribute } from '@/lib/client/api/attributes';
import { getApiErrorMessage } from '@/lib/utils/apiError';
import type { UpdateAttributeFormValues } from './validations';

type SubmitUpdateAttributeArgs = {
  attributeId: string | number;
  value: UpdateAttributeFormValues;
};

export const submitUpdateAttribute = async ({
  attributeId,
  value,
}: SubmitUpdateAttributeArgs) => {
  const result = await updateAttribute({
    attributeId,
    name: value.name.trim(),
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
