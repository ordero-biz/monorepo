'use client';

import { Button, Dialog, TextField } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { unitsOfMeasurementQueryKeys } from '@/lib/query/units-of-measurement/unitsOfMeasurementQueryKeys';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { useCreateUnitOfMeasurementForm } from './hooks/useCreateUnitOfMeasurementForm';
import {
  validateUnitOfMeasurementCode,
  validateUnitOfMeasurementName,
  validateUnitOfMeasurementSymbol,
} from './utils/validations';

export const CreateUnitOfMeasurementDialog = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { form } = useCreateUnitOfMeasurementForm({
    onCreated: async () => {
      setOpen(false);
      await queryClient.invalidateQueries({
        queryKey: unitsOfMeasurementQueryKeys.list,
      });
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      form.reset();
    }
  };

  return (
    <>
      <Button
        color="primary"
        onClick={() => handleOpenChange(true)}
        type="button"
      >
        Add Unit of Measurement
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
                  <Dialog.Title>Add unit of measurement</Dialog.Title>
                </Dialog.Header>

                <Dialog.Content>
                  <div className="flex flex-col gap-[var(--space-2)]">
                    <form.Field
                      name="code"
                      validators={{
                        onChange: validateUnitOfMeasurementCode,
                        onSubmit: validateUnitOfMeasurementCode,
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
                            label="Code"
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

                    <form.Field
                      name="name"
                      validators={{
                        onChange: validateUnitOfMeasurementName,
                        onSubmit: validateUnitOfMeasurementName,
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
                            value={field.state.value}
                            size="s"
                          />
                        );
                      }}
                    </form.Field>

                    <form.Field
                      name="symbol"
                      validators={{
                        onChange: validateUnitOfMeasurementSymbol,
                        onSubmit: validateUnitOfMeasurementSymbol,
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
                            label="Symbol"
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

                    <form.Field name="comment">
                      {(field) => {
                        const errorText = getFieldSubmitChangeErrorText(
                          field.state.meta
                        );

                        return (
                          <TextField
                            errorText={errorText}
                            invalid={Boolean(errorText)}
                            label="Comment"
                            name={field.name}
                            onBlur={field.handleBlur}
                            onValueChange={field.handleChange}
                            value={field.state.value}
                            size="s"
                          />
                        );
                      }}
                    </form.Field>
                  </div>
                </Dialog.Content>

                <Dialog.Footer>
                  <form.Subscribe
                    selector={(state) =>
                      [
                        state.values.code,
                        state.values.name,
                        state.values.symbol,
                        state.isSubmitting,
                      ] as const
                    }
                  >
                    {([code, name, symbol, isSubmitting]) => (
                      <Button
                        disabled={
                          isSubmitting ||
                          !code.trim() ||
                          !name.trim() ||
                          !symbol.trim()
                        }
                        type="submit"
                      >
                        {isSubmitting ? 'Adding...' : 'Add'}
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
