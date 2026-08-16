import {
  Button,
  Dialog,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@ordero/ui';
import { CategoriesAsyncCombobox } from '@/features/categories';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import {
  validateCategoryName,
  validateCategoryParentId,
} from '../../shared/validations';
import type { CreateCategoryDialogFormContentProps } from './types';
import { validateCategoryStatus } from './utils/validations';

const PARENT_CATEGORY_STATIC_OPTIONS = [
  {
    label: 'No parent category',
    value: '',
  },
];

export const CreateCategoryDialogFormContent = ({
  form,
}: CreateCategoryDialogFormContentProps) => {
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

          <form.Field
                name="status"
                validators={{
                  onChange: validateCategoryStatus,
                  onSubmit: validateCategoryStatus,
                }}
              >
                {(field) => {
                  const errorText = getFieldSubmitChangeErrorText(
                    field.state.meta
                  );

                  return (
                    <RadioGroup
                      errorText={errorText}
                      invalid={Boolean(errorText)}
                      label="Category status"
                      name={field.name}
                      onValueChange={(value) =>
                        field.handleChange(value as 'draft' | 'active')
                      }
                      orientation="vertical"
                      required
                      value={field.state.value}
                    >
                      <Radio value="draft" align="start">
                        <div className="flex flex-col">
                          Draft
                          <Typography color="text-secondary" variant="caption">
                            Editable only. Cannot be assigned to products or
                            tracked in analytics. Can be activated later
                          </Typography>
                        </div>
                      </Radio>
                      <Radio value="active" align="start">
                        <div className="flex flex-col">
                          Active
                          <Typography color="text-secondary" variant="caption">
                            Fully functional. Can be assigned to products and tracked in analytics. Cannot be edited after publishing
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
            <Button type="submit">
              {isSubmitting
                ? status === 'draft'
                  ? 'Saving...'
                  : 'Publishing...'
                : status === 'draft'
                  ? 'Save draft'
                  : 'Publish'}
            </Button>
          )}
        </form.Subscribe>
      </Dialog.Footer>
    </>
  );
};
