import type { Attribute } from '@/lib/domain/attributes/types';

export type ActivateAttributeDialogProps = {
  attribute: Attribute;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => Promise<void> | void;
  open: boolean;
};

export type ActivateAttributeDialogTriggerProps = {
  attribute: Attribute;
  onUpdated: () => Promise<void> | void;
};
