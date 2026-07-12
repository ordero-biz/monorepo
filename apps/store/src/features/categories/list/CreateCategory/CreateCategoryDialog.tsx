'use client';

import { Button, Dialog, Select, TextField } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { Category } from '@/lib/domain/categories';
import { categoriesQueryKeys } from '@/lib/query/categories/categoriesQueryKeys';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { createCategoryDefaultValues } from './constants';
import { useCreateCategoryForm } from './hooks/useCreateCategoryForm';
import {
  validateCategoryName,
  validateCategoryParentId,
} from './utils/validations';

type CreateCategoryDialogProps = {
  availableCategories: Category[];
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export const CreateCategoryDialog = ({
  availableCategories,
  onOpenChange,
  open,
}: CreateCategoryDialogProps) => {
  const queryClient = useQueryClient();
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
  const { form } = useCreateCategoryForm({
    onCreated: async () => {
      onOpenChange(false);
      await queryClient.invalidateQueries({
        queryKey: categoriesQueryKeys.list,
      });
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      form.reset(createCategoryDefaultValues);
    }
  };

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup size="xs">
            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                form.handleSubmit();
              }}
            >
              <Dialog.Header>
                <Dialog.Title>Create new category</Dialog.Title>
              </Dialog.Header>

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
                        field.state.meta
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
                    name="parentId"
                    validators={{
                      onChange: validateCategoryParentId,
                      onSubmit: validateCategoryParentId,
                    }}
                  >
                    {(field) => {
                      const errorText = getFieldSubmitChangeErrorText(
                        field.state.meta
                      );

                      return (
                        <Select
                          errorText={errorText}
                          invalid={Boolean(errorText)}
                          label="Parent category"
                          name={field.name}
                          onBlur={field.handleBlur}
                          onValueChange={(value) =>
                            field.handleChange(value || null)
                          }
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
                  selector={(state) =>
                    [state.values.name, state.isSubmitting] as const
                  }
                >
                  {([name, isSubmitting]) => {
                    const isCreateDisabled = isSubmitting || !name.trim();

                    return (
                      <Button disabled={isCreateDisabled} type="submit">
                        {isSubmitting ? 'Creating...' : 'Create'}
                      </Button>
                    );
                  }}
                </form.Subscribe>
              </Dialog.Footer>
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
