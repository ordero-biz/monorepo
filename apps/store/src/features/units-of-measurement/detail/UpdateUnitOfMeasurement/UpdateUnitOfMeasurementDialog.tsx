'use client';

import { Button, Dialog, TextField } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/units-of-measurement/constants';
import { unitsOfMeasurementQueryKeys } from '@/lib/query/units-of-measurement/unitsOfMeasurementQueryKeys';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { validateUnitOfMeasurementName } from '../../shared/validations';
import { useUpdateUnitOfMeasurementForm } from './hooks/useUpdateUnitOfMeasurementForm';
import type { UpdateUnitOfMeasurementDialogProps } from './types';
import { getUnitOfMeasurementDefaultValues } from './utils/fields';

export const UpdateUnitOfMeasurementDialog = ({
  onOpenChange,
  onUpdated,
  open,
  unitOfMeasurement,
}: UpdateUnitOfMeasurementDialogProps) => {
  const queryClient = useQueryClient();
  const { form } = useUpdateUnitOfMeasurementForm({
    onNoChanges: () => handleOpenChange(false),
    onUpdated: async (updatedUnitOfMeasurement) => {
      form.reset(getUnitOfMeasurementDefaultValues(updatedUnitOfMeasurement));
      onOpenChange(false);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: unitsOfMeasurementQueryKeys.list,
        }),
        queryClient.invalidateQueries({
          queryKey: unitsOfMeasurementQueryKeys.detail(unitOfMeasurement.id),
        }),
      ]);
      await onUpdated(updatedUnitOfMeasurement);
    },
    unitOfMeasurement,
  });

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      form.reset(getUnitOfMeasurementDefaultValues(unitOfMeasurement));
    }
  };

  const isUnitOfMeasurementActive =
    unitOfMeasurement.status === UNIT_OF_MEASUREMENT_STATUS.ACTIVE;

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
                  {!isUnitOfMeasurementActive ? (
                    <form.Field
                      name="name"
                      validators={{
                        onChange: validateUnitOfMeasurementName,
                        onSubmit: validateUnitOfMeasurementName,
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

                  <form.Field name="symbol">
                    {(field) => {
                      const errorText = getFieldSubmitChangeErrorText(
                        field.state.meta
                      );

                      return (
                        <TextField
                          errorText={errorText}
                          helperText="Short abbreviation for the unit (e.g., kg, cm)"
                          invalid={Boolean(errorText)}
                          label="Symbol"
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
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
