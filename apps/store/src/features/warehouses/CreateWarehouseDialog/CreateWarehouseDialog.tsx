'use client';

import { Button, Dialog, TextField } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { warehousesQueryKeys } from '@/lib/query/warehouses/warehousesQueryKeys';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { useCreateWarehouseForm } from './hooks/useCreateWarehouseForm';
import {
  validateWarehouseAddress,
  validateWarehouseCode,
  validateWarehouseName,
} from './utils/validations';

export const CreateWarehouseDialog = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { form } = useCreateWarehouseForm({
    onCreated: async () => {
      setOpen(false);
      await queryClient.invalidateQueries({
        queryKey: warehousesQueryKeys.list,
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
        Add Warehouse
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
                  <Dialog.Title>Add warehouse</Dialog.Title>
                </Dialog.Header>

                <Dialog.Content>
                  <div className="flex flex-col gap-[var(--space-2)]">
                    <form.Field
                      name="code"
                      validators={{
                        onChange: validateWarehouseCode,
                        onSubmit: validateWarehouseCode,
                      }}
                    >
                      {(field) => {
                        const errorText = getFieldSubmitChangeErrorText(
                          field.state.meta
                        );

                        return (
                          <TextField
                            aria-label="Warehouse code"
                            errorText={errorText}
                            invalid={Boolean(errorText)}
                            name={field.name}
                            onBlur={field.handleBlur}
                            onValueChange={field.handleChange}
                            placeholder="WH-001"
                            required
                            value={field.state.value}
                          />
                        );
                      }}
                    </form.Field>

                    <form.Field
                      name="name"
                      validators={{
                        onChange: validateWarehouseName,
                        onSubmit: validateWarehouseName,
                      }}
                    >
                      {(field) => {
                        const errorText = getFieldSubmitChangeErrorText(
                          field.state.meta
                        );

                        return (
                          <TextField
                            aria-label="Warehouse name"
                            errorText={errorText}
                            invalid={Boolean(errorText)}
                            name={field.name}
                            onBlur={field.handleBlur}
                            onValueChange={field.handleChange}
                            placeholder="Main Warehouse"
                            required
                            value={field.state.value}
                          />
                        );
                      }}
                    </form.Field>

                    <form.Field
                      name="address"
                      validators={{
                        onChange: validateWarehouseAddress,
                        onSubmit: validateWarehouseAddress,
                      }}
                    >
                      {(field) => {
                        const errorText = getFieldSubmitChangeErrorText(
                          field.state.meta
                        );

                        return (
                          <TextField
                            aria-label="Warehouse address"
                            errorText={errorText}
                            invalid={Boolean(errorText)}
                            name={field.name}
                            onBlur={field.handleBlur}
                            onValueChange={field.handleChange}
                            placeholder="123 Commerce Ave"
                            required
                            value={field.state.value}
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
                            aria-label="Warehouse comment"
                            errorText={errorText}
                            invalid={Boolean(errorText)}
                            name={field.name}
                            onBlur={field.handleBlur}
                            onValueChange={field.handleChange}
                            placeholder="Comment"
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
                      [
                        state.values.code,
                        state.values.name,
                        state.values.address,
                        state.isSubmitting,
                      ] as const
                    }
                  >
                    {([code, name, address, isSubmitting]) => (
                      <Button
                        disabled={
                          isSubmitting ||
                          !code.trim() ||
                          !name.trim() ||
                          !address.trim()
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
