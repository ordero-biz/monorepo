import type {
  FormAsyncValidateOrFn,
  FormValidateOrFn,
  ReactFormApi,
} from '@tanstack/react-form';
import type { SupplierEntityFormValues } from './validations';

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

export type SupplierEntityFormApi = FormControls<SupplierEntityFormValues>;
