import { createAttribute } from '@/lib/client/api/attributes';
import type {
  AttributeValueFormValue,
  CreateAttributeFormValues,
} from './validations';

const normalizeAttributeValues = ({
  attributeValues,
}: {
  attributeValues: AttributeValueFormValue[];
}) =>
  attributeValues.map((attributeValue) => ({
    name: attributeValue.value.trim(),
    sortOrder: 0,
    status: attributeValue.status
  }));

export const submitCreateAttribute = async (
  value: CreateAttributeFormValues
) => {
  const result = await createAttribute({
    name: value.name.trim(),
    sortOrder: 0,
    status: value.status,
    attributeValues: normalizeAttributeValues({
      attributeValues: value.attributeValues,
    }).filter((attributeValue) => attributeValue.name),
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
