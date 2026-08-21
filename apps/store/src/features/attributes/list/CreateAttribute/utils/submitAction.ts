import { createAttribute } from '@/lib/client/api/attributes';
import {
  ATTRIBUTE_STATUS,
  ATTRIBUTE_VALUE_STATUS,
} from '@/lib/domain/attributes/constants';
import type {
  AttributeValueFormValue,
  CreateAttributeFormValues,
} from './validations';

const normalizeAttributeValues = ({
  attributeStatus,
  attributeValues,
}: {
  attributeStatus: CreateAttributeFormValues['status'];
  attributeValues: AttributeValueFormValue[];
}) =>
  attributeValues.map((attributeValue) => ({
    name: attributeValue.value.trim(),
    sortOrder: 0,
    status:
      attributeStatus === ATTRIBUTE_STATUS.DRAFT
        ? ATTRIBUTE_VALUE_STATUS.DRAFT
        : attributeValue.status,
  }));

export const submitCreateAttribute = async (
  value: CreateAttributeFormValues
) => {
  const result = await createAttribute({
    name: value.name.trim(),
    sortOrder: 0,
    status: value.status,
    attributeValues: normalizeAttributeValues({
      attributeStatus: value.status,
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
