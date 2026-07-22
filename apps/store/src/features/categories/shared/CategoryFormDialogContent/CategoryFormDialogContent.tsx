import { Button, Dialog, TextField } from '@ordero/ui';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { CategoriesAsyncCombobox } from '../CategoriesAsyncCombobox';
import { validateCategoryName, validateCategoryParentId } from '../validations';
import type { CategoryFormDialogContentProps } from './types';

const PARENT_CATEGORY_STATIC_OPTIONS = [
  {
    label: 'No parent category',
    value: '',
  },
];

export const CategoryFormDialogContent = ({
  disabledCategoryIds,
  form,
  pendingText,
  submitText,
}: CategoryFormDialogContentProps) => {
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
                  onValueChange={(value) => field.handleChange(value || null)}
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
        <form.Subscribe
          selector={(state) => [state.values.name, state.isSubmitting] as const}
        >
          {([name, isSubmitting]) => (
            <Button disabled={isSubmitting || !name.trim()} type="submit">
              {isSubmitting ? pendingText : submitText}
            </Button>
          )}
        </form.Subscribe>
      </Dialog.Footer>
    </>
  );
};
