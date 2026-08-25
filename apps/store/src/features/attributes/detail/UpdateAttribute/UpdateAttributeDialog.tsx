'use client';

import { Button, Dialog, TextField } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import type { Attribute } from '@/lib/domain/attributes/types';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { useUpdateAttributeForm } from './hooks/useUpdateAttributeForm';
import type { UpdateAttributeDialogProps } from './types';
import { validateUpdateAttributeName } from './utils/validations';

const getAttributeFormValues = ({ name }: Attribute) => ({ name });

export const UpdateAttributeDialog = ({
  attribute,
  onOpenChange,
  onUpdated,
  open,
}: UpdateAttributeDialogProps) => {
  const queryClient = useQueryClient();
  const latestAttributeRef = useRef(attribute);
  const [formValues, setFormValues] = useState(() =>
    getAttributeFormValues(attribute)
  );
  const { form } = useUpdateAttributeForm({
    attributeId: attribute.id,
    initialName: formValues.name,
    onNoChanges: () => handleOpenChange(false),
    onUpdated: async (updatedAttribute) => {
      const updatedFormValues = getAttributeFormValues(updatedAttribute);

      latestAttributeRef.current = updatedAttribute;
      setFormValues(updatedFormValues);
      form.reset(updatedFormValues);
      onOpenChange(false);
      await queryClient.invalidateQueries({
        queryKey: attributesQueryKeys.list,
      });
      await queryClient.invalidateQueries({
        queryKey: attributesQueryKeys.detail(attribute.id),
      });
      await onUpdated(updatedAttribute);
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    form.reset(getAttributeFormValues(latestAttributeRef.current));
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
