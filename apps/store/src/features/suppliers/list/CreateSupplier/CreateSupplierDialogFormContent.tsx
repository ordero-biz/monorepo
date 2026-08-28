import { SUPPLIER_STATUS } from '@/lib/domain/suppliers/constants';
import type { SupplierStatus } from '@/lib/domain/suppliers/types';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import {
  Button,
  Dialog,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@/ui/index';
import {
  validateSupplierEmail,
  validateSupplierName,
  validateSupplierStatus,
} from '../../shared/validations';
import type { CreateSupplierDialogFormContentProps } from './types';

export const CreateSupplierDialogFormContent = ({
  form,
}: CreateSupplierDialogFormContentProps) => {
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
            name="status"
            validators={{
              onChange: validateSupplierStatus,
              onSubmit: validateSupplierStatus,
            }}
          >
            {(field) => {
              const errorText = getFieldSubmitChangeErrorText(field.state.meta);

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
                        Editable only. Cannot be used in supplies or tracked in
                        analytics. Can be activated later
                      </Typography>
                    </div>
                  </Radio>
                  <Radio align="start" value={SUPPLIER_STATUS.ACTIVE}>
                    <div className="flex flex-col">
                      Active
                      <Typography color="text-secondary" variant="caption">
                        Fully functional. Can be used in supplies and tracked in
                        analytics. Name and status cannot be edited after
                        publishing
                      </Typography>
                    </div>
                  </Radio>
                </RadioGroup>
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
                  size="s"
                  value={field.state.value}
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
                  value={field.state.value}
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
                  value={field.state.value ?? ''}
                />
              );
            }}
          </form.Field>
        </div>
      </Dialog.Content>

      <Dialog.Footer>
        <form.Subscribe
          selector={(state) =>
            [state.isSubmitting, state.values.status] as const
          }
        >
          {([isSubmitting, status]) => (
            <Button type="submit">
              {isSubmitting
                ? status === SUPPLIER_STATUS.DRAFT
                  ? 'Saving...'
                  : 'Publishing...'
                : status === SUPPLIER_STATUS.DRAFT
                  ? 'Save draft'
                  : 'Publish'}
            </Button>
          )}
        </form.Subscribe>
      </Dialog.Footer>
    </>
  );
};
