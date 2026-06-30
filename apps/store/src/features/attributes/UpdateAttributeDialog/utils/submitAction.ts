import { updateAttribute } from '@/lib/client/api/attributes';
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
        formError: result.error.message,
      },
    } as const;
  }

  return {
    ok: true,
    data: result.data,
  } as const;
};
