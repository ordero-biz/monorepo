import { Button, Dialog, TextField } from '@ordero/ui';
import { useStore } from '@tanstack/react-form';
import { CategoriesAsyncCombobox } from '@/features/categories';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import {
  validateCategoryName,
  validateCategoryParent,
} from '../../shared/validations';
import type { UpdateCategoryDialogFormContentProps } from './types';

export const UpdateCategoryDialogFormContent = ({
  disabledCategoryIds,
  form,
}: UpdateCategoryDialogFormContentProps) => {
  const submissionAttempts = useStore(
    form.store,
    (state) => state.submissionAttempts
  );

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
              const errorText = getFieldSubmitChangeErrorText(
                field.state.meta,
                submissionAttempts
              );

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
            name="parentCategory"
            validators={{
              onChange: validateCategoryParent,
              onSubmit: validateCategoryParent,
            }}
          >
            {(field) => {
              const errorText = getFieldSubmitChangeErrorText(
                field.state.meta,
                submissionAttempts
              );

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
                  allowNoParent
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
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          )}
        </form.Subscribe>
      </Dialog.Footer>
    </>
  );
};
