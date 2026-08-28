'use client';

import {
  Button,
  Dialog,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/units-of-measurement/constants';
import type { UnitOfMeasurementStatus } from '@/lib/domain/units-of-measurement/types';
import { unitsOfMeasurementQueryKeys } from '@/lib/query/units-of-measurement/unitsOfMeasurementQueryKeys';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import {
  validateUnitOfMeasurementName,
  validateUnitOfMeasurementStatus,
} from '../../shared/validations';
import { useCreateUnitOfMeasurementForm } from './hooks/useCreateUnitOfMeasurementForm';
import type { CreateUnitOfMeasurementDialogProps } from './types';

export const CreateUnitOfMeasurementDialog = ({
  onOpenChange,
  open,
}: CreateUnitOfMeasurementDialogProps) => {
  const queryClient = useQueryClient();

  const { form } = useCreateUnitOfMeasurementForm({
    onCreated: async () => {
      onOpenChange(false);
      await queryClient.invalidateQueries({
        queryKey: unitsOfMeasurementQueryKeys.list,
      });
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      form.reset();
    }
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
                <Dialog.Title>Add unit of measurement</Dialog.Title>
              </Dialog.Header>

              <Dialog.Content>
                <div className="flex flex-col gap-[var(--space-2)]">
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

                  <form.Field
                    name="status"
                    validators={{
                      onChange: validateUnitOfMeasurementStatus,
                      onSubmit: validateUnitOfMeasurementStatus,
                    }}
                  >
                    {(field) => {
                      const errorText = getFieldSubmitChangeErrorText(
                        field.state.meta
                      );

                      return (
                        <RadioGroup
                          errorText={errorText}
                          invalid={Boolean(errorText)}
                          label="Unit status"
                          name={field.name}
                          onValueChange={(value) =>
                            field.handleChange(value as UnitOfMeasurementStatus)
                          }
                          orientation="vertical"
                          required
                          value={field.state.value}
                        >
                          <Radio
                            align="start"
                            value={UNIT_OF_MEASUREMENT_STATUS.DRAFT}
                          >
                            <div className="flex flex-col">
                              Draft
                              <Typography
                                color="text-secondary"
                                variant="caption"
                              >
                                Editable only. Cannot be used in supplies or
                                tracked in analytics. Can be activated later
                              </Typography>
                            </div>
                          </Radio>
                          <Radio
                            align="start"
                            value={UNIT_OF_MEASUREMENT_STATUS.ACTIVE}
                          >
                            <div className="flex flex-col">
                              Active
                              <Typography
                                color="text-secondary"
                                variant="caption"
                              >
                                Fully functional. Can be used in supplies and
                                tracked in analytics. Name and status cannot be
                                edited after publishing
                              </Typography>
                            </div>
                          </Radio>
                        </RadioGroup>
                      );
                    }}
                  </form.Field>

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
                <form.Subscribe
                  selector={(state) =>
                    [state.values.status, state.isSubmitting] as const
                  }
                >
                  {([status, isSubmitting]) => (
                    <Button disabled={isSubmitting} type="submit">
                      {isSubmitting
                        ? status === UNIT_OF_MEASUREMENT_STATUS.DRAFT
                          ? 'Saving...'
                          : 'Publishing...'
                        : status === UNIT_OF_MEASUREMENT_STATUS.DRAFT
                          ? 'Save draft'
                          : 'Publish'}
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
