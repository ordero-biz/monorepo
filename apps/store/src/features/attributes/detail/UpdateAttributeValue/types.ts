import type { AttributeValue } from '@/lib/domain/attributes/types';
export type UpdateAttributeValueDialogProps = {
  attributeId: string | number;
  attributeValue: AttributeValue;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};
