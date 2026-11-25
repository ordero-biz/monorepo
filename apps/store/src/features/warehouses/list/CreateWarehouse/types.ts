import type {
  FormAsyncValidateOrFn,
  FormValidateOrFn,
  ReactFormApi,
} from '@tanstack/react-form';
import type { CreateWarehouseFormValues } from './utils/validations';

type FormValidate = FormValidateOrFn<CreateWarehouseFormValues> | undefined;
type FormAsyncValidate =
  | FormAsyncValidateOrFn<CreateWarehouseFormValues>
  | undefined;

type CreateWarehouseFormApi = Pick<
  ReactFormApi<
    CreateWarehouseFormValues,
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

export type CreateWarehouseDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export type CreateWarehouseDialogFormContentProps = {
  form: CreateWarehouseFormApi;
};
