import { Card, Textarea, TextField, Typography } from '@ordero/ui';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { SuppliersAsyncCombobox, WarehousesAsyncCombobox } from './selectors';
import type { SupplyInformationProps } from './types';

export const SupplyInformation = ({ form }: SupplyInformationProps) => (
  <Card.Root variant="filled">
    <Card.Content>
      <div className="flex flex-col gap-[var(--space-3)]">
        <Typography variant="h6">Supply information</Typography>
        <div className="grid gap-[var(--space-3)] md:grid-cols-2">
          <form.Field name="supplier">
            {(field) => {
              const errorText = getFieldSubmitChangeErrorText(field.state.meta);

              return (
                <SuppliersAsyncCombobox
                  errorText={errorText}
                  invalid={Boolean(errorText)}
                  label="Supplier"
                  name={field.name}
                  onBlur={field.handleBlur}
                  onValueChange={field.handleChange}
                  placeholder="Select supplier"
                  required
                  value={field.state.value}
                />
              );
            }}
          </form.Field>
          <form.Field name="warehouse">
            {(field) => {
              const errorText = getFieldSubmitChangeErrorText(field.state.meta);

              return (
                <WarehousesAsyncCombobox
                  errorText={errorText}
                  invalid={Boolean(errorText)}
                  label="Warehouse"
                  name={field.name}
                  onBlur={field.handleBlur}
                  onValueChange={field.handleChange}
                  placeholder="Select warehouse"
                  required
                  value={field.state.value}
                />
              );
            }}
          </form.Field>
          <form.Field name="supplyNumber">
            {(field) => {
              const errorText = getFieldSubmitChangeErrorText(field.state.meta);

              return (
                <TextField
                  errorText={errorText}
                  invalid={Boolean(errorText)}
                  label="Supply number"
                  name={field.name}
                  onBlur={field.handleBlur}
                  onValueChange={field.handleChange}
                  placeholder="Enter supply number"
                  required
                  value={field.state.value}
                />
              );
            }}
          </form.Field>
          <form.Field name="supplierInvoiceNumber">
            {(field) => (
              <TextField
                label="Supplier invoice number"
                name={field.name}
                onBlur={field.handleBlur}
                onValueChange={field.handleChange}
                placeholder="Enter invoice number"
                value={field.state.value}
              />
            )}
          </form.Field>
          <div className="md:col-span-2">
            <form.Field name="comment">
              {(field) => (
                <Textarea
                  label="Comment"
                  name={field.name}
                  onBlur={field.handleBlur}
                  onValueChange={field.handleChange}
                  placeholder="Add a comment (optional)"
                  resize="vertical"
                  rows={3}
                  value={field.state.value}
                />
              )}
            </form.Field>
          </div>
        </div>
      </div>
    </Card.Content>
  </Card.Root>
);
