'use client';

import { Button, Dialog, TextField } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { suppliersQueryKeys } from '@/lib/query/suppliers/suppliersQueryKeys';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { useCreateSupplierForm } from './hooks/useCreateSupplierForm';
import {
  validateSupplierAddress,
  validateSupplierEmail,
  validateSupplierName,
  validateSupplierPhone,
} from './utils/validations';

type CreateSupplierDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export const CreateSupplierDialog = ({
  onOpenChange,
  open,
}: CreateSupplierDialogProps) => {
  const queryClient = useQueryClient();

  const { form } = useCreateSupplierForm({
    onCreated: async () => {
      onOpenChange(false);
      await queryClient.invalidateQueries({
        queryKey: suppliersQueryKeys.list,
      });
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      form.reset();
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
                <Dialog.Title>Add supplier</Dialog.Title>
              </Dialog.Header>

              <Dialog.Content>
                <div className="flex flex-col gap-[var(--space-2)]">
                  <form.Field
                    name="name"
                    validators={{
                      onChange: validateSupplierName,
                      onSubmit: validateSupplierName,
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
                    name="email"
                    validators={{
                      onChange: validateSupplierEmail,
                      onSubmit: validateSupplierEmail,
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
                          label="Email"
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
                    name="phone"
                    validators={{
                      onChange: validateSupplierPhone,
                      onSubmit: validateSupplierPhone,
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
                          label="Phone"
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
                      onChange: validateSupplierAddress,
                      onSubmit: validateSupplierAddress,
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
                      state.values.name,
                      state.values.email,
                      state.values.phone,
                      state.values.address,
                      state.isSubmitting,
                    ] as const
                  }
                >
                  {([name, email, phone, address, isSubmitting]) => (
                    <Button
                      disabled={
                        isSubmitting ||
                        !name.trim() ||
                        !email.trim() ||
                        !phone.trim() ||
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
  );
};
