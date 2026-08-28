import {
  Button,
  Dialog,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@ordero/ui';
import { useState } from 'react';
import { CategoriesAsyncCombobox } from '@/features/categories';
import { CATEGORY_STATUS } from '@/lib/domain/categories/constants';
import type { Category, CategoryStatus } from '@/lib/domain/categories/types';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import {
  validateCategoryName,
  validateCategoryParentId,
  validateCategoryStatus,
} from '../../shared/validations';
import type { CreateCategoryDialogFormContentProps } from './types';

const PARENT_CATEGORY_STATIC_OPTIONS = [
  {
    displayValue: 'No parent category',
    label: 'No parent category',
    value: '',
  },
];

export const CreateCategoryDialogFormContent = ({
  form,
}: CreateCategoryDialogFormContentProps) => {
  const [parentStatus, setParentStatus] = useState<Category['status']>();
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
                  onOptionSelect={(option) => {
                    const category = option?.data as Category | undefined;

                    setParentStatus(category?.status);

                    if (
                      category?.status?.toLowerCase() ===
                      CATEGORY_STATUS.DRAFT.toLowerCase()
                    ) {
                      form.setFieldValue('status', CATEGORY_STATUS.DRAFT);
                    }
                  }}
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
              const errorText = getFieldSubmitChangeErrorText(field.state.meta);

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
