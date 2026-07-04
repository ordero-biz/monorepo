'use client';

import { Button, Dialog, TextField } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import type { Attribute } from '@/lib/domain/attributes';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { useUpdateAttributeForm } from './hooks/useUpdateAttributeForm';
import { validateUpdateAttributeName } from './utils/validations';

type UpdateAttributeDialogProps = {
  attribute: Attribute;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => Promise<void> | void;
  open: boolean;
};

export const UpdateAttributeDialog = ({
  attribute,
  onOpenChange,
  onUpdated,
  open,
}: UpdateAttributeDialogProps) => {
  const queryClient = useQueryClient();
  const { form } = useUpdateAttributeForm({
    attributeId: attribute.id,
    initialName: attribute.name,
    onUpdated: async () => {
      onOpenChange(false);
      await queryClient.invalidateQueries({
        queryKey: attributesQueryKeys.list,
      });
      await onUpdated();
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      form.reset({
        name: attribute.name,
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
                <Dialog.Title>Edit Attribute</Dialog.Title>
              </Dialog.Header>

              <Dialog.Content>
                <form.Field
                  name="name"
                  validators={{
                    onChange: validateUpdateAttributeName,
                    onSubmit: validateUpdateAttributeName,
                  }}
                >
                  {(field) => {
                    const errorText = getFieldSubmitChangeErrorText(
                      field.state.meta
                    );

                    return (
                      <TextField
                        aria-label="Attribute name"
                        errorText={errorText}
                        invalid={Boolean(errorText)}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onValueChange={field.handleChange}
                        placeholder="Color"
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
