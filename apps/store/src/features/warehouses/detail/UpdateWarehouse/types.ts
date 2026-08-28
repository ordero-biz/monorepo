import type {
  FormAsyncValidateOrFn,
  FormValidateOrFn,
  ReactFormApi,
} from '@tanstack/react-form';
import type { Warehouse } from '@/lib/domain/warehouses/types';
import type { WarehouseFormValues } from '../../shared/validations';

type FormValidate = FormValidateOrFn<WarehouseFormValues> | undefined;
type FormAsyncValidate = FormAsyncValidateOrFn<WarehouseFormValues> | undefined;

type UpdateWarehouseFormApi = Pick<
  ReactFormApi<
    WarehouseFormValues,
    FormValidate,
    FormValidate,
    FormAsyncValidate,
    FormValidate,
    FormAsyncValidate,
    FormValidate,
    FormAsyncValidate,
    FormValidate,
    FormAsyncValidate,
    FormAsyncValidate,
    unknown
  >,
  'Field' | 'Subscribe'
>;

export type UpdateWarehouseDialogProps = {
  onOpenChange: (open: boolean) => void;
  onUpdated: () => Promise<void> | void;
  open: boolean;
  warehouse: Warehouse;
};

export type UpdateWarehouseDialogTriggerProps = {
  onUpdated: () => Promise<void> | void;
  warehouse: Warehouse;
};

export type UpdateWarehouseFormDialogContentProps = {
  form: UpdateWarehouseFormApi;
  isWarehouseActive: boolean;
};
