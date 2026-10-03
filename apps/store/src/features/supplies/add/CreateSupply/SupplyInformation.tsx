import { Card, Textarea, TextField, Typography } from '@ordero/ui';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { SupplyStatusChip } from '../../shared/SupplyStatusChip';
import { SuppliersAsyncCombobox, WarehousesAsyncCombobox } from './selectors';
import type { SupplyInformationProps } from './types';

export const SupplyInformation = ({
  form,
  initialSupply,
  readOnly,
}: SupplyInformationProps) => (
  <Card.Root variant="filled">
    <Card.Content>
      <div className="flex flex-col gap-[var(--space-3)]">
        <div className="flex items-center justify-between">
          <Typography variant="h6">Supply information</Typography>
          {initialSupply ? (
            <SupplyStatusChip status={initialSupply.status} />
          ) : null}
        </div>
        <div className="grid gap-[var(--space-3)] md:grid-cols-2">
          <form.Field name="supplierId">
            {(field) => {
              const errorText = getFieldSubmitChangeErrorText(field.state.meta);
              const selectedName = form.state.values.supplierName;

              return (
                <SuppliersAsyncCombobox
                  disabled={readOnly}
                  errorText={errorText}
                  invalid={Boolean(errorText)}
                  label="Supplier"
                  name={field.name}
                  onBlur={field.handleBlur}
                  onOptionSelect={(option) => {
                    form.setFieldValue(
                      'supplierName',
                      option?.displayValue ?? ''
                    );
                  }}
                  onValueChange={field.handleChange}
                  placeholder="Select supplier"
                  required
                  staticOptions={
                    field.state.value && selectedName
                      ? [
                          {
                            displayValue: selectedName,
                            value: field.state.value,
                          },
                        ]
                      : []
                  }
                  value={field.state.value}
                />
              );
            }}
          </form.Field>
          <form.Field name="warehouseId">
            {(field) => {
              const errorText = getFieldSubmitChangeErrorText(field.state.meta);
              const selectedName = form.state.values.warehouseName;

              return (
                <WarehousesAsyncCombobox
                  disabled={readOnly}
                  errorText={errorText}
                  invalid={Boolean(errorText)}
                  label="Warehouse"
                  name={field.name}
                  onBlur={field.handleBlur}
                  onOptionSelect={(option) => {
                    form.setFieldValue(
                      'warehouseName',
                      option?.displayValue ?? ''
                    );
                  }}
                  onValueChange={field.handleChange}
                  placeholder="Select warehouse"
                  required
                  staticOptions={
                    field.state.value && selectedName
                      ? [
                          {
                            displayValue: selectedName,
                            value: field.state.value,
                          },
                        ]
                      : []
                  }
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
                  readOnly={readOnly}
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
                readOnly={readOnly}
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
                  readOnly={readOnly}
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
