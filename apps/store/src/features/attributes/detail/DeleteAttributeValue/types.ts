import type { AttributeValue } from '@/lib/domain/attributes';

export type DeleteAttributeValueDialogProps = {
  attributeId: string | number;
  attributeValue: AttributeValue;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export type DeleteAttributeValuesDialogProps = {
  attributeId: string | number;
  attributeValues: AttributeValue[];
  onDeleted?: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};
