import type { AttributeValue } from '@/lib/domain/attributes';

export type DeleteAttributeValueDialogProps = {
  attributeId: string | number;
  attributeValue: AttributeValue;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};
