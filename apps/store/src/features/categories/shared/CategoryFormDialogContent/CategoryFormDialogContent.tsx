import { Button, Dialog, Select, TextField } from '@ordero/ui';
import { useMemo } from 'react';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { validateCategoryName, validateCategoryParentId } from '../validations';
import type { CategoryFormDialogContentProps } from './types';

export const CategoryFormDialogContent = ({
  availableCategories,
  form,
  pendingText,
  submitText,
}: CategoryFormDialogContentProps) => {
  const parentCategoryOptions = useMemo(
    () => [
      {
        label: 'No parent category',
        value: '',
      },
      ...availableCategories.map((category) => ({
        label: category.name,
        value: String(category.id),
      })),
    ],
    [availableCategories]
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
                <Select
                  errorText={errorText}
                  invalid={Boolean(errorText)}
                  label="Parent category"
                  name={field.name}
                  onBlur={field.handleBlur}
                  onValueChange={(value) => field.handleChange(value || null)}
                  options={parentCategoryOptions}
                  placeholder=""
                  size="s"
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
