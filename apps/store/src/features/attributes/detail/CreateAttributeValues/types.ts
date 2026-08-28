import type { AttributeStatus } from '@/lib/domain/attributes/types';
import type { useCreateAttributeValuesForm } from './hooks/useCreateAttributeValuesForm';

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

export type CreateAttributeValuesDialogFormContentProps = {
  attributeStatus: AttributeStatus;
  form: ReturnType<typeof useCreateAttributeValuesForm>['form'];
  open: boolean;
};

export type CreateAttributeValuesFieldsProps = {
  attributeStatus: AttributeStatus;
  form: ReturnType<typeof useCreateAttributeValuesForm>['form'];
  open: boolean;
};
