import type {
  FormAsyncValidateOrFn,
  FormValidateOrFn,
  ReactFormApi,
} from '@tanstack/react-form';
import type { Category } from '@/lib/domain/categories';
import type { CategoryFormValues } from '../validations';

export type CategoryOption = Pick<Category, 'id' | 'name'>;

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

type CategoryFormApi = FormControls<CategoryFormValues>;

export type CategoryFormDialogContentProps = {
  availableCategories: CategoryOption[];
  form: CategoryFormApi;
  pendingText: string;
  submitText: string;
};
