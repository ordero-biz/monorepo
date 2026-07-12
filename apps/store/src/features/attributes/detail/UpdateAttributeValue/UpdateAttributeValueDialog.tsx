'use client';

import { Button, Dialog, TextField } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import type { AttributeValue } from '@/lib/domain/attributes';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { useUpdateAttributeValueForm } from './hooks/useUpdateAttributeValueForm';
import { validateUpdateAttributeValueName } from './utils/validations';

type UpdateAttributeValueDialogProps = {
  attributeId: string | number;
  attributeValue: AttributeValue;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

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
    onUpdated: async () => {
      onOpenChange(false);
      await queryClient.invalidateQueries({
        queryKey: attributesQueryKeys.values(attributeId),
      });
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
                        name={field.name}
                        onBlur={field.handleBlur}
                        onValueChange={field.handleChange}
                        placeholder="Blue"
                        required
                        value={field.state.value}
                      />
                    );
                  }}
                </form.Field>
              </Dialog.Content>

              <Dialog.Footer>
                <form.Subscribe
                  selector={(state) =>
                    [state.values.name, state.isSubmitting] as const
                  }
                >
                  {([name, isSubmitting]) => (
                    <Button
                      disabled={isSubmitting || !name.trim()}
                      type="submit"
                    >
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
