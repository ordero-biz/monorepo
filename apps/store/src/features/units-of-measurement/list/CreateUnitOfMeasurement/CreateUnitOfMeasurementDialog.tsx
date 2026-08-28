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
import type { UnitOfMeasurementStatus } from '@/lib/domain/unitsOfMeasurement';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/unitsOfMeasurement';
import { unitsOfMeasurementQueryKeys } from '@/lib/query/units-of-measurement/unitsOfMeasurementQueryKeys';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { useCreateUnitOfMeasurementForm } from './hooks/useCreateUnitOfMeasurementForm';
import type { CreateUnitOfMeasurementDialogProps } from './types';
import {
  validateUnitOfMeasurementName,
  validateUnitOfMeasurementSymbol,
} from './utils/validations';

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
                    name="symbol"
                    validators={{
                      onChange: validateUnitOfMeasurementSymbol,
                      onSubmit: validateUnitOfMeasurementSymbol,
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

                  <form.Field name="status">
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
                                Editable only. Cannot be assigned to products or
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
                                Fully functional. Can be assigned to products
                                and tracked in analytics. Cannot be edited after
                                publishing
                              </Typography>
                            </div>
                          </Radio>
                        </RadioGroup>
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
                    [state.isSubmitting, state.values.status] as const
                  }
                >
                  {([isSubmitting, status]) => (
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
