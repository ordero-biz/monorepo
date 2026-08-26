import type { SupplierStatus } from '@/lib/domain/suppliers';
import { SUPPLIER_STATUS } from '@/lib/domain/suppliers';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import {
  Button,
  Dialog,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@/ui/index';
import type { SupplierFormDialogContentProps } from './types';
import {
  validateSupplierAddress,
  validateSupplierEmail,
  validateSupplierName,
  validateSupplierPhone,
} from './validations';

export const SupplierFormDialogContent = ({
  form,
  isCreate = false,
  pendingText,
  showEmail = true,
  showStatus = true,
  submitText,
}: SupplierFormDialogContentProps) => {
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

          {showStatus ? (
            <form.Field name="status">
              {(field) => {
                const errorText = getFieldSubmitChangeErrorText(
                  field.state.meta
                );

                return (
                  <RadioGroup
                    errorText={errorText}
                    invalid={Boolean(errorText)}
                    label="Supplier status"
                    name={field.name}
                    onValueChange={(value) =>
                      field.handleChange(value as SupplierStatus)
                    }
                    orientation="vertical"
                    required
                    value={field.state.value}
                  >
                    <Radio align="start" value={SUPPLIER_STATUS.DRAFT}>
                      <div className="flex flex-col">
                        Draft
                        <Typography color="text-secondary" variant="caption">
                          Editable only. Cannot be assigned to products or
                          tracked in analytics. Can be activated later
                        </Typography>
                      </div>
                    </Radio>
                    <Radio align="start" value={SUPPLIER_STATUS.ACTIVE}>
                      <div className="flex flex-col">
                        Active
                        <Typography color="text-secondary" variant="caption">
                          Fully functional. Can be assigned to products and
                          tracked in analytics. Cannot be edited after
                          publishing
                        </Typography>
                      </div>
                    </Radio>
                  </RadioGroup>
                );
              }}
            </form.Field>
          ) : null}

          {showEmail ? (
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
          ) : null}

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
              state.values.status,
              state.values.phone,
              state.values.address,
              state.isSubmitting,
            ] as const
          }
        >
          {([name, status, phone, address, isSubmitting]) => (
            <Button
              disabled={
                isSubmitting || !name.trim() || !phone.trim() || !address.trim()
              }
              type="submit"
            >
              {isCreate
                ? isSubmitting
                  ? status === SUPPLIER_STATUS.DRAFT
                    ? 'Saving...'
                    : 'Publishing...'
                  : status === SUPPLIER_STATUS.DRAFT
                    ? 'Save draft'
                    : 'Publish'
                : isSubmitting
                  ? pendingText
                  : submitText}
            </Button>
          )}
        </form.Subscribe>
      </Dialog.Footer>
    </>
  );
};
