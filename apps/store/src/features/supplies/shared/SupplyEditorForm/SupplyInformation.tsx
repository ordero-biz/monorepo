import { Card, Textarea, TextField } from '@ordero/ui';
import { useStore } from '@tanstack/react-form';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { SuppliersAsyncCombobox, WarehousesAsyncCombobox } from './selectors';
import type { SupplyInformationProps } from './types';
import {
  validateSupplyNumber,
  validateSupplySupplier,
  validateSupplyWarehouse,
} from './validations';

export const SupplyInformation = ({
  disabled,
  form,
}: SupplyInformationProps) => {
  const submissionAttempts = useStore(
    form.store,
    (state) => state.submissionAttempts
  );

  return (
    <Card.Root variant="filled">
      <Card.Header>
        <Card.Title>Supply information</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="grid gap-[var(--space-2)] sm:grid-cols-2">
          <form.Field
            name="supplier"
            validators={{
              onChange: validateSupplySupplier,
            }}
          >
            {(field) => {
              const errorText = getFieldSubmitChangeErrorText(
                field.state.meta,
                submissionAttempts
              );

              return (
                <SuppliersAsyncCombobox
                  disabled={disabled}
                  errorText={errorText}
                  invalid={Boolean(errorText)}
                  label="Supplier"
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
            name="warehouse"
            validators={{
              onChange: validateSupplyWarehouse,
            }}
          >
            {(field) => {
              const errorText = getFieldSubmitChangeErrorText(
                field.state.meta,
                submissionAttempts
              );

              return (
                <WarehousesAsyncCombobox
                  disabled={disabled}
                  errorText={errorText}
                  invalid={Boolean(errorText)}
                  label="Warehouse"
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
            name="supplyNumber"
            validators={{
              onChange: validateSupplyNumber,
            }}
          >
            {(field) => {
              const errorText = getFieldSubmitChangeErrorText(
                field.state.meta,
                submissionAttempts
              );

              return (
                <TextField
                  disabled={disabled}
                  errorText={errorText}
                  invalid={Boolean(errorText)}
                  label="Supply number"
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
          <form.Field name="supplierInvoiceNumber">
            {(field) => (
              <TextField
                disabled={disabled}
                label="Supplier invoice number"
                name={field.name}
                onBlur={field.handleBlur}
                onValueChange={field.handleChange}
                size="s"
                value={field.state.value}
              />
            )}
          </form.Field>
          <div className="md:col-span-2">
            <form.Field name="comment">
              {(field) => (
                <Textarea
                  disabled={disabled}
                  label="Comment"
                  name={field.name}
                  onBlur={field.handleBlur}
                  onValueChange={field.handleChange}
                  resize="none"
                  rows={2}
                  value={field.state.value}
                />
              )}
            </form.Field>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  );
};
