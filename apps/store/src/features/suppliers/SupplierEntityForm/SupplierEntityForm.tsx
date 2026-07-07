import { Button, Dialog, TextField } from '@ordero/ui';
import type { useCreateSupplierForm } from '@/features/suppliers/CreateSupplierDialog/hooks/useCreateSupplierForm';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import {
  validateSupplierAddress,
  validateSupplierEmail,
  validateSupplierName,
  validateSupplierPhone,
} from '../CreateSupplierDialog/utils/validations';

type SupplierEntityFormApi = ReturnType<typeof useCreateSupplierForm>['form'];

type SupplierEntityFormProps = {
  form: SupplierEntityFormApi;
  pendingText: string;
  submitText: string;
};

export const SupplierEntityForm = ({
  form,
  pendingText,
  submitText,
}: SupplierEntityFormProps) => {
  return (
    <>
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
              const errorText = getFieldSubmitChangeErrorText(field.state.meta);

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
              const errorText = getFieldSubmitChangeErrorText(field.state.meta);

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
              const errorText = getFieldSubmitChangeErrorText(field.state.meta);

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
              const errorText = getFieldSubmitChangeErrorText(field.state.meta);

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
              const errorText = getFieldSubmitChangeErrorText(field.state.meta);

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
              {isSubmitting ? pendingText : submitText}
            </Button>
          )}
        </form.Subscribe>
      </Dialog.Footer>
    </>
  );
};
