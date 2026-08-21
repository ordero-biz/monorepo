import type { Attribute } from '@/lib/domain/attributes/types';

export type DeleteAttributeDialogProps = {
  attribute: Attribute;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};
