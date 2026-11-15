import { Card, Textarea, TextField } from '@ordero/ui';
import { useStore } from '@tanstack/react-form';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { TransferWarehouseCombobox } from './TransferWarehouseCombobox';
import type { TransferInformationProps } from './types';
import {
  validateTransferDestinationWarehouse,
  validateTransferNumber,
  validateTransferSourceWarehouse,
} from './validations';

export const TransferInformation = ({
  form,
  sourceWarehouseRef,
}: TransferInformationProps) => {
  const submissionAttempts = useStore(
    form.store,
    (state) => state.submissionAttempts
  );

  const sourceWarehouse = useStore(
    form.store,
    (state) => state.values.sourceWarehouse
  );

  return (
    <Card.Root variant="filled">
      <Card.Header>
        <Card.Title>Transfer information</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="grid gap-[var(--space-2)] sm:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-[var(--space-2)]">
            <form.Field
              name="transferNumber"
              validators={{
                onChange: validateTransferNumber,
              }}
            >
              {(field) => {
                const errorText = getFieldSubmitChangeErrorText(
                  field.state.meta,
                  submissionAttempts
                );

                return (
                  <TextField
                    errorText={errorText}
                    invalid={Boolean(errorText)}
                    label="Name"
                    name={field.name}
                    onBlur={field.handleBlur}
                    onValueChange={field.handleChange}
                    placeholder="e.g. Weekend restock"
                    required
                    size="s"
                    value={field.state.value}
                  />
                );
              }}
            </form.Field>
            <form.Field
              name="sourceWarehouse"
              validators={{
                onChange: validateTransferSourceWarehouse,
              }}
            >
              {(field) => {
                const errorText = getFieldSubmitChangeErrorText(
                  field.state.meta,
                  submissionAttempts
                );

                return (
                  <TransferWarehouseCombobox
                    errorText={errorText}
                    invalid={Boolean(errorText)}
                    label="From warehouse"
                    name={field.name}
                    onBlur={field.handleBlur}
                    onValueChange={field.handleChange}
                    placeholder="Select warehouse"
                    ref={sourceWarehouseRef}
                    required
                    size="s"
                    value={field.state.value}
                  />
                );
              }}
            </form.Field>
            <form.Field
              name="destinationWarehouse"
              validators={{
                onChangeListenTo: ['sourceWarehouse'],
                onChange: ({ value, fieldApi }) =>
                  validateTransferDestinationWarehouse({
                    value,
                    sourceWarehouse:
                      fieldApi.form.getFieldValue('sourceWarehouse'),
                  }),
              }}
            >
              {(field) => {
                const errorText = getFieldSubmitChangeErrorText(
                  field.state.meta,
                  submissionAttempts
                );

                return (
                  <TransferWarehouseCombobox
                    errorText={errorText}
                    invalid={Boolean(errorText)}
                    isOptionDisabled={(warehouse) =>
                      warehouse.id === sourceWarehouse?.id
                    }
                    label="To warehouse"
                    name={field.name}
                    onBlur={field.handleBlur}
                    onValueChange={field.handleChange}
                    placeholder="Select warehouse"
                    required
                    size="s"
                    value={field.state.value}
                  />
                );
              }}
            </form.Field>
          </div>
          <form.Field name="comment">
            {(field) => (
              <Textarea
                label="Comment"
                name={field.name}
                onBlur={field.handleBlur}
                onValueChange={field.handleChange}
                placeholder="Add a note for the receiving warehouse"
                resize="none"
                rows={7}
                value={field.state.value}
              />
            )}
          </form.Field>
        </div>
      </Card.Content>
    </Card.Root>
  );
};
