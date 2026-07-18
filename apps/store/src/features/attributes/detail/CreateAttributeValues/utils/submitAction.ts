import { createAttributeValues } from '@/lib/client/api/attributes';
import type {
  AttributeValueFormValue,
  CreateAttributeValuesFormValues,
} from './validations';

type SubmitCreateAttributeValuesArgs = {
  attributeId: string | number;
  value: CreateAttributeValuesFormValues;
};

const normalizeAttributeValues = (attributeValues: AttributeValueFormValue[]) =>
  attributeValues
    .map((attributeValue) => attributeValue.value.trim())
    .filter(Boolean)
    .map((name) => ({
      name,
      sortOrder: 0,
    }));

const mapAttributeValueFieldErrors = (
  fieldErrors: Record<string, string> | undefined
) => {
  if (!fieldErrors) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(fieldErrors).map(([fieldName, errorMessage]) => [
      fieldName.replace(/^(attributeValues\[\d+\])\.name$/, '$1.value'),
      errorMessage,
    ])
  );
};

export const submitCreateAttributeValues = async ({
  attributeId,
  value,
}: SubmitCreateAttributeValuesArgs) => {
  const result = await createAttributeValues({
    attributeId,
    attributeValues: normalizeAttributeValues(value.attributeValues),
  });

  if (!result.ok) {
    return {
      ok: false,
      error: {
        fieldErrors: mapAttributeValueFieldErrors(result.error.fieldErrors),
        formError: result.error.message,
      },
    } as const;
  }

  return {
    ok: true,
    data: result.data,
  } as const;
};
