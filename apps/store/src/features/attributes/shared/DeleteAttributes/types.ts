import type { Attribute } from '@/lib/domain/attributes/types';

export type DeleteAttributesDialogProps = {
  attributes: Attribute[];
  onDeleted?: () => void | Promise<void>;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};
