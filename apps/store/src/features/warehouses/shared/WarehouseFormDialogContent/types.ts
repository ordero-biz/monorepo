import type {
  FormAsyncValidateOrFn,
  FormValidateOrFn,
  ReactFormApi,
} from '@tanstack/react-form';
import type { WarehouseFormValues } from '../validations';

type FormValidate<TFormValues> = FormValidateOrFn<TFormValues> | undefined;

type FormAsyncValidate<TFormValues> =
  | FormAsyncValidateOrFn<TFormValues>
  | undefined;

type FormControls<TFormValues> = Pick<
  ReactFormApi<
    TFormValues,
    FormValidate<TFormValues>,
    FormValidate<TFormValues>,
    FormAsyncValidate<TFormValues>,
    FormValidate<TFormValues>,
    FormAsyncValidate<TFormValues>,
    FormValidate<TFormValues>,
    FormAsyncValidate<TFormValues>,
    FormValidate<TFormValues>,
    FormAsyncValidate<TFormValues>,
    FormAsyncValidate<TFormValues>,
    unknown
  >,
  'Field' | 'Subscribe'
>;

type WarehouseFormApi = FormControls<WarehouseFormValues>;

export type WarehouseFormDialogContentProps = {
  form: WarehouseFormApi;
  pendingText: string;
  submitText: string;
};
