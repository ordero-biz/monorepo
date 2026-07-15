import type { Attribute } from '@/lib/domain/attributes';

export type DeleteAttributeDialogProps = {
  attribute: Attribute;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};
