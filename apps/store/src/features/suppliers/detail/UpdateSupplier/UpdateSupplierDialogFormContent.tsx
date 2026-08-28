import { Button, Dialog, TextField } from '@ordero/ui';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import {
  validateSupplierEmail,
  validateSupplierName,
} from '../../shared/validations';
import type { UpdateSupplierDialogFormContentProps } from './types';

export const UpdateSupplierDialogFormContent = ({
  form,
  isSupplierActive,
}: UpdateSupplierDialogFormContentProps) => {
  return (
    <>
      <Dialog.Content>
        <div className="flex flex-col gap-[var(--space-2)]">
          {!isSupplierActive ? (
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
          ) : null}

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
                  size="s"
                  value={field.state.value ?? ''}
                />
              );
            }}
          </form.Field>

          <form.Field name="phone">
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
                  size="s"
                  value={field.state.value ?? ''}
                />
              );
            }}
          </form.Field>

          <form.Field name="address">
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
                  size="s"
                  value={field.state.value ?? ''}
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
                  value={field.state.value ?? ''}
                />
              );
            }}
          </form.Field>
        </div>
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
    </>
  );
};
