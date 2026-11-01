import {
  Button,
  Dialog,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@ordero/ui';
import { useStore } from '@tanstack/react-form';
import { CategoriesAsyncCombobox } from '@/features/categories';
import { CATEGORY_STATUS } from '@/lib/domain/categories/constants';
import type { CategoryStatus } from '@/lib/domain/categories/types';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import {
  validateCategoryName,
  validateCategoryParent,
  validateCategoryStatus,
} from '../../shared/validations';
import type { CreateCategoryDialogFormContentProps } from './types';

export const CreateCategoryDialogFormContent = ({
  form,
}: CreateCategoryDialogFormContentProps) => {
  const submissionAttempts = useStore(
    form.store,
    (state) => state.submissionAttempts
  );

  const parentStatus = useStore(
    form.store,
    (state) => state.values.parentCategory?.status
  );
  const hasDraftParent = parentStatus?.toLowerCase() === 'draft';

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
                  errorText={errorText}
                  invalid={Boolean(errorText)}
                  label="Parent category"
                  name={field.name}
                  onBlur={field.handleBlur}
                  onValueChange={(category) => {
                    field.handleChange(category);

                    if (
                      category?.status?.toLowerCase() ===
                      CATEGORY_STATUS.DRAFT.toLowerCase()
                    ) {
                      form.setFieldValue('status', CATEGORY_STATUS.DRAFT);
                    }
                  }}
                  placeholder=""
                  size="s"
                  allowNoParent
                  value={field.state.value}
                />
              );
            }}
          </form.Field>

          <form.Field
            name="status"
            validators={{
              onChange: validateCategoryStatus,
              onSubmit: validateCategoryStatus,
            }}
          >
            {(field) => {
              const errorText = getFieldSubmitChangeErrorText(
                field.state.meta,
                submissionAttempts
              );

              return (
                <RadioGroup
                  errorText={errorText}
                  invalid={Boolean(errorText)}
                  label="Category status"
                  name={field.name}
                  onValueChange={(value) =>
                    field.handleChange(value as CategoryStatus)
                  }
                  orientation="vertical"
                  required
                  value={field.state.value}
                >
                  <Radio value={CATEGORY_STATUS.DRAFT} align="start">
                    <div className="flex flex-col">
                      Draft
                      <Typography color="text-secondary" variant="caption">
                        Editable only. Cannot be assigned to products or tracked
                        in analytics. Can be activated later
                      </Typography>
                    </div>
                  </Radio>
                  <Radio
                    disabled={hasDraftParent}
                    value={CATEGORY_STATUS.ACTIVE}
                    align="start"
                  >
                    <div className="flex flex-col">
                      Active
                      <Typography
                        color={hasDraftParent ? 'warning' : 'text-secondary'}
                        variant="caption"
                      >
                        {hasDraftParent
                          ? 'Parent category is a draft. Choose an active parent to enable this'
                          : 'Fully functional. Can be assigned to products and tracked in analytics. Cannot be edited after publishing'}
                      </Typography>
                    </div>
                  </Radio>
                </RadioGroup>
              );
            }}
          </form.Field>
        </div>
      </Dialog.Content>

      <Dialog.Footer>
        <form.Subscribe
          selector={(state) =>
            [state.isSubmitting, state.values.status] as const
          }
        >
          {([isSubmitting, status]) => (
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting
                ? status === CATEGORY_STATUS.DRAFT
                  ? 'Saving...'
                  : 'Publishing...'
                : status === CATEGORY_STATUS.DRAFT
                  ? 'Save draft'
                  : 'Publish'}
            </Button>
          )}
        </form.Subscribe>
      </Dialog.Footer>
    </>
  );
};
