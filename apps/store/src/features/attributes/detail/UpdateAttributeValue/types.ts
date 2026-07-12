import type { AttributeValue } from '@/lib/domain/attributes';
export type UpdateAttributeValueDialogProps = {
  attributeId: string | number;
  attributeValue: AttributeValue;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};
