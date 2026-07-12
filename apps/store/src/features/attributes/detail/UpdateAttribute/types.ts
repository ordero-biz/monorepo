import type { Attribute } from '@/lib/domain/attributes';

export type UpdateAttributeDialogProps = {
  attribute: Attribute;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => Promise<void> | void;
  open: boolean;
};

export type UpdateAttributeDialogTriggerProps = {
  attribute: Attribute;
  onUpdated: () => Promise<void> | void;
};
