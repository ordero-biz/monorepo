import { createAttribute } from '@/lib/client/api/attributes';
import type {
  AttributeValueFormValue,
  CreateAttributeFormValues,
} from './validations';

const normalizeAttributeValues = (attributeValues: AttributeValueFormValue[]) =>
  attributeValues
    .map((attributeValue) => attributeValue.value.trim())
    .filter(Boolean)
    .map((name) => ({
      name,
      sortOrder: 0,
    }));

export const submitCreateAttribute = async (
  value: CreateAttributeFormValues
) => {
  const result = await createAttribute({
    name: value.name.trim(),
    sortOrder: 0,
    attributeValues: normalizeAttributeValues(value.attributeValues),
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
