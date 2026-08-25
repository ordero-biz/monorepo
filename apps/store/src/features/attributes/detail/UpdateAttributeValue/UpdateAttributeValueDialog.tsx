'use client';

import { Button, Dialog, TextField } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { useUpdateAttributeValueForm } from './hooks/useUpdateAttributeValueForm';
import type { UpdateAttributeValueDialogProps } from './types';
import { validateUpdateAttributeValueName } from './utils/validations';
export const UpdateAttributeValueDialog = ({
  attributeId,
  attributeValue,
  onOpenChange,
  open,
}: UpdateAttributeValueDialogProps) => {
  const queryClient = useQueryClient();
  const { form } = useUpdateAttributeValueForm({
    attributeValueId: attributeValue.id,
    initialName: attributeValue.name,
    initialSortOrder: attributeValue.sortOrder,
    onNoChanges: () => handleOpenChange(false),
    onUpdated: async (updatedAttributeValue) => {
      form.reset({
        name: updatedAttributeValue.name,
        sortOrder: updatedAttributeValue.sortOrder,
      });
      onOpenChange(false);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: attributesQueryKeys.list,
        }),
        queryClient.invalidateQueries({
          queryKey: attributesQueryKeys.values(attributeId),
        }),
      ]);
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      form.reset({
        name: attributeValue.name,
        sortOrder: attributeValue.sortOrder,
      });
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
                <Dialog.Title>Edit Attribute Value</Dialog.Title>
              </Dialog.Header>

              <Dialog.Content>
                <form.Field
                  name="name"
                  validators={{
                    onChange: validateUpdateAttributeValueName,
                    onSubmit: validateUpdateAttributeValueName,
                  }}
                >
                  {(field) => {
                    const errorText = getFieldSubmitChangeErrorText(
                      field.state.meta
                    );

                    return (
                      <TextField
                        aria-label="Attribute value name"
                        errorText={errorText}
                        invalid={Boolean(errorText)}
                        label="Name"
                        name={field.name}
                        onBlur={field.handleBlur}
                        onValueChange={field.handleChange}
                        required
                        value={field.state.value}
                        size="s"
                      />
                    );
                  }}
                </form.Field>
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
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
