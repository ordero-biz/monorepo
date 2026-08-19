import { z } from 'zod';
import { ATTRIBUTE_STATUS } from '@/lib/domain/attributes/constants';
import type { ValidationArgs } from '@/lib/utils/form/validation/types';

export const attributeNameSchema = z
  .string()
  .trim()
  .min(1, 'Attribute name is required');

export const attributeStatusSchema = z.enum(
  [ATTRIBUTE_STATUS.DRAFT, ATTRIBUTE_STATUS.ACTIVE],
  {
    error: 'Attribute status must be Draft or Active',
  }
);

export const attributeValueStatusSchema = z.enum(
  [ATTRIBUTE_STATUS.DRAFT, ATTRIBUTE_STATUS.ACTIVE],
  {
    error: 'Attribute value status must be Draft or Active',
  }
);

export const attributeValueSchema = z.object({
  id: z.string(),
  status: attributeValueStatusSchema,
  value: z.string(),
});

export const createAttributeSchema = z.object({
  name: attributeNameSchema,
  status: attributeStatusSchema,
  attributeValues: z.array(attributeValueSchema),
});

export type AttributeValueFormValue = z.infer<typeof attributeValueSchema>;
export type CreateAttributeFormValues = z.infer<typeof createAttributeSchema>;

export const validateAttributeName = ({ value }: ValidationArgs<string>) => {
  const result = attributeNameSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};

export const validateAttributeStatus = ({
  value,
}: ValidationArgs<z.infer<typeof createAttributeSchema>['status']>) => {
  const result = attributeStatusSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};

export const validateAttributeValueStatus = ({
  value,
}: ValidationArgs<AttributeValueFormValue['status']>) => {
  const result = attributeValueStatusSchema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};
