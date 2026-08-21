import type { AttributeStatus } from '@/lib/domain/attributes/types';

export type CreateAttributeValuesDialogProps = {
  attributeId: string | number;
  attributeStatus: AttributeStatus;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export type CreateAttributeValuesDialogTriggerProps = {
  attributeId: string | number;
  attributeStatus: AttributeStatus;
};
