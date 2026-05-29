'use client';

import { Button, Dialog, TextField } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import {
  attributeNameDefaultValue,
  validateAttributeName,
} from './validations';

export const CreateAttributeDialog = () => {
  const [open, setOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      name: attributeNameDefaultValue,
    },
    onSubmit: ({ formApi }) => {
      setOpen(false);
      formApi.reset();
    },
  });

  const resetForm = () => {
    form.reset();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      resetForm();
    }
  };

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={open}>
      <Dialog.Trigger>Create Attribute</Dialog.Trigger>

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
                <Dialog.Title>Create new attribute</Dialog.Title>
              </Dialog.Header>

              <Dialog.Content>
                <div className="flex flex-col gap-[var(--space-2)]">
                  <form.Field
                    name="name"
                    validators={{
                      onChange: ({ value }) => validateAttributeName(value),
                      onSubmit: ({ value }) => validateAttributeName(value),
                    }}
                  >
                    {(field) => {
                      const submitError = field.state.meta.errorMap.onSubmit;
                      const changeError = field.state.meta.errorMap.onChange;
                      const errorText = submitError
                        ? submitError
                        : field.state.meta.isBlurred
                          ? changeError
                          : undefined;

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
                </div>
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
                        Boolean(validateAttributeName(name)) || isSubmitting
                      }
                      type="submit"
                    >
                      Create
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
