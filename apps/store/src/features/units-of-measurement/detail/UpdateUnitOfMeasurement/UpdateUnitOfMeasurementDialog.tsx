'use client';

import { Button, Dialog, TextField } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import type { UnitOfMeasurement } from '@/lib/domain/unitsOfMeasurement';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/unitsOfMeasurement';
import { unitsOfMeasurementQueryKeys } from '@/lib/query/units-of-measurement/unitsOfMeasurementQueryKeys';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { useUpdateUnitOfMeasurementForm } from './hooks/useUpdateUnitOfMeasurementForm';
import type { UpdateUnitOfMeasurementDialogProps } from './types';
import {
  type UpdateUnitOfMeasurementFormValues,
  validateUpdateUnitOfMeasurementName,
  validateUpdateUnitOfMeasurementSymbol,
} from './utils/validations';

const getUnitOfMeasurementFormValues = ({
  name,
  status = UNIT_OF_MEASUREMENT_STATUS.DRAFT,
  symbol,
  comment,
}: UnitOfMeasurement): UpdateUnitOfMeasurementFormValues => ({
  name,
  status,
  symbol,
  comment,
});

export const UpdateUnitOfMeasurementDialog = ({
  onOpenChange,
  onUpdated,
  open,
  unitOfMeasurement,
}: UpdateUnitOfMeasurementDialogProps) => {
  const queryClient = useQueryClient();
  const latestUnitOfMeasurementRef = useRef(unitOfMeasurement);
  const [formValues, setFormValues] = useState(() =>
    getUnitOfMeasurementFormValues(unitOfMeasurement)
  );
  const { form } = useUpdateUnitOfMeasurementForm({
    initialValues: formValues,
    onUpdated: async (updatedUnitOfMeasurement) => {
      const updatedFormValues = getUnitOfMeasurementFormValues(
        updatedUnitOfMeasurement
      );

      latestUnitOfMeasurementRef.current = updatedUnitOfMeasurement;
      setFormValues(updatedFormValues);
      form.reset(updatedFormValues);
      onOpenChange(false);
      await queryClient.invalidateQueries({
        queryKey: unitsOfMeasurementQueryKeys.list,
      });
      await onUpdated(updatedUnitOfMeasurement);
    },
    unitOfMeasurementId: unitOfMeasurement.id,
  });

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    form.reset(
      getUnitOfMeasurementFormValues(latestUnitOfMeasurementRef.current)
    );
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
                <Dialog.Title>Edit unit of measurement</Dialog.Title>
              </Dialog.Header>

              <Dialog.Content>
                <div className="flex flex-col gap-[var(--space-2)]">
                  <form.Field
                    name="name"
                    validators={{
                      onChange: validateUpdateUnitOfMeasurementName,
                      onSubmit: validateUpdateUnitOfMeasurementName,
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
                    name="symbol"
                    validators={{
                      onChange: validateUpdateUnitOfMeasurementSymbol,
                      onSubmit: validateUpdateUnitOfMeasurementSymbol,
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
                          label="Symbol"
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
                      state.values.symbol,
                      state.isSubmitting,
                    ] as const
                  }
                >
                  {([name, symbol, isSubmitting]) => (
                    <Button
                      disabled={isSubmitting || !name.trim() || !symbol.trim()}
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
