import { createAttributeValues } from '@/lib/client/api/attributes';
import { ATTRIBUTE_STATUS } from '@/lib/domain/attributes/constants';
import type { AttributeStatus } from '@/lib/domain/attributes/types';
import type {
  AttributeValueFormValue,
  CreateAttributeValuesFormValues,
} from './validations';

type SubmitCreateAttributeValuesArgs = {
  attributeId: string | number;
  attributeStatus: AttributeStatus;
  value: CreateAttributeValuesFormValues;
};

type NormalizeAttributeValuesArgs = {
  attributeStatus: AttributeStatus;
  attributeValues: AttributeValueFormValue[];
};

const normalizeAttributeValues = ({
  attributeStatus,
  attributeValues,
}: NormalizeAttributeValuesArgs) =>
  attributeValues
    .map((attributeValue) => ({
      name: attributeValue.value.trim(),
      sortOrder: 0,
      status:
        attributeStatus === ATTRIBUTE_STATUS.DRAFT
          ? ATTRIBUTE_STATUS.DRAFT
          : attributeValue.status,
    }))
    .filter((attributeValue) => attributeValue.name);

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
  attributeStatus,
  value,
}: SubmitCreateAttributeValuesArgs) => {
  const result = await createAttributeValues({
    attributeId,
    attributeValues: normalizeAttributeValues({
      attributeStatus,
      attributeValues: value.attributeValues,
    }),
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
