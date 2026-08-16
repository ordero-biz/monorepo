import { Button, Dialog, TextField } from '@ordero/ui';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { CategoriesAsyncCombobox } from '@/features/categories';
import {
  validateCategoryName,
  validateCategoryParentId,
} from '../../shared/validations';
import type { UpdateCategoryDialogFormContentProps } from './types';

const PARENT_CATEGORY_STATIC_OPTIONS = [
  {
    displayValue: 'No parent category',
    label: 'No parent category',
    value: '',
  },
];

export const UpdateCategoryDialogFormContent = ({
  disabledCategoryIds,
  form,
}: UpdateCategoryDialogFormContentProps) => {
  return (
    <>
      <Dialog.Content>
        <div className="flex flex-col gap-[var(--space-2)]">
          <form.Field
            name="name"
            validators={{
              onChange: validateCategoryName,
              onSubmit: validateCategoryName,
            }}
          >
            {(field) => {
              const errorText = getFieldSubmitChangeErrorText(field.state.meta);

              return (
                <TextField
                  errorText={errorText}
                  invalid={Boolean(errorText)}
                  label="Name"
                  name={field.name}
                  onBlur={field.handleBlur}
                  onValueChange={field.handleChange}
                  required
                  size="s"
                  value={field.state.value}
                />
              );
            }}
          </form.Field>

          <form.Field
            name="parentId"
            validators={{
              onChange: validateCategoryParentId,
              onSubmit: validateCategoryParentId,
            }}
          >
            {(field) => {
              const errorText = getFieldSubmitChangeErrorText(field.state.meta);

              return (
                <CategoriesAsyncCombobox
                  disabledCategoryIds={disabledCategoryIds}
                  errorText={errorText}
                  invalid={Boolean(errorText)}
                  label="Parent category"
                  name={field.name}
                  onBlur={field.handleBlur}
                  onValueChange={field.handleChange}
                  placeholder=""
                  size="s"
                  staticOptions={PARENT_CATEGORY_STATIC_OPTIONS}
                  value={field.state.value}
                />
              );
            }}
          </form.Field>
        </div>
      </Dialog.Content>

      <Dialog.Footer>
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit">{isSubmitting ? 'Saving...' : 'Save'}</Button>
          )}
        </form.Subscribe>
      </Dialog.Footer>
    </>
  );
};
