import type { Attribute } from '@/lib/domain/attributes/types';

export type UpdateAttributeDialogProps = {
  attribute: Attribute;
  onOpenChange: (open: boolean) => void;
  onUpdated?: (attribute: Attribute) => Promise<void> | void;
  open: boolean;
};

export type UpdateAttributeDialogTriggerProps = {
  attribute: Attribute;
  onUpdated: (attribute: Attribute) => Promise<void> | void;
};
