'use client';

import { Button, Dialog, TextField } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { Attribute } from '@/lib/domain/attributes';
import { attributesQueryKeys } from '@/lib/hooks/useAttributesQuery';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { useUpdateAttributeForm } from './hooks/useUpdateAttributeForm';
import { validateUpdateAttributeName } from './utils/validations';

type UpdateAttributeDialogProps = {
  attribute: Attribute;
  onUpdated: () => Promise<void> | void;
};

export const UpdateAttributeDialog = ({
  attribute,
  onUpdated,
}: UpdateAttributeDialogProps) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { form } = useUpdateAttributeForm({
    attributeId: attribute.id,
    initialName: attribute.name,
    onUpdated: async () => {
      setOpen(false);
      await queryClient.invalidateQueries({
        queryKey: attributesQueryKeys.list,
      });
      await onUpdated();
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    form.reset({
      name: attribute.name,
    });
  };

  return (
    <>
      <Button
        color="primary"
        onClick={() => handleOpenChange(true)}
        type="button"
        variant="outlined"
      >
        Edit Attribute
      </Button>

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
                      onChange: ({ value }) =>
                        validateUpdateAttributeName(value),
                      onSubmit: ({ value }) =>
                        validateUpdateAttributeName(value),
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
                          onValueChange={(value) => field.handleChange(value)}
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
                        disabled={
                          Boolean(validateUpdateAttributeName(name)) ||
                          isSubmitting
                        }
                        type="submit"
                      >
                        Save
                      </Button>
                    )}
                  </form.Subscribe>
                </Dialog.Footer>
              </form>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
