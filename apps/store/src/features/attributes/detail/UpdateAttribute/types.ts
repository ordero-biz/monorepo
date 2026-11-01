import type { Attribute } from '@/lib/domain/attributes/types';

export type UpdateAttributeDialogProps = {
  attribute: Attribute;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};
