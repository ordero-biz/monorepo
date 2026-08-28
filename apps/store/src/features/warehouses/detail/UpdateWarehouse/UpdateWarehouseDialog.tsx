'use client';

import { Button, Dialog, TextField } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { warehousesQueryKeys } from '@/lib/query/warehouses/warehousesQueryKeys';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import {
  validateWarehouseAddress,
  validateWarehouseCode,
  validateWarehouseName,
} from '../../shared/validations';
import { useUpdateWarehouseForm } from './hooks/useUpdateWarehouseForm';
import type { UpdateWarehouseDialogProps } from './types';
import { getWarehouseDefaultValues } from './utils/fields';

export const UpdateWarehouseDialog = ({
  warehouse,
  onOpenChange,
  onUpdated,
  open,
}: UpdateWarehouseDialogProps) => {
  const queryClient = useQueryClient();
  const { form } = useUpdateWarehouseForm({
    warehouse,
    onUpdated: async (updatedWarehouse) => {
      form.reset(getWarehouseDefaultValues(updatedWarehouse));
      onOpenChange(false);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: warehousesQueryKeys.list,
        }),
        queryClient.invalidateQueries({
          queryKey: warehousesQueryKeys.detail(warehouse.id),
        }),
      ]);
      await onUpdated();
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      form.reset(getWarehouseDefaultValues(warehouse));
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
                <Dialog.Title>Edit warehouse</Dialog.Title>
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
                          errorText={errorText}
                          invalid={Boolean(errorText)}
                          label="Code"
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
                          errorText={errorText}
                          invalid={Boolean(errorText)}
                          label="Address"
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
