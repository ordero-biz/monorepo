import {
  Button,
  Dialog,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@ordero/ui';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/units-of-measurement/constants';
import type { UnitOfMeasurementStatus } from '@/lib/domain/units-of-measurement/types';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import {
  validateUnitOfMeasurementName,
  validateUnitOfMeasurementStatus,
} from '../../shared/validations';
import type { CreateUnitOfMeasurementDialogFormContentProps } from './types';

export const CreateUnitOfMeasurementDialogFormContent = ({
  form,
}: CreateUnitOfMeasurementDialogFormContentProps) => {
  return (
    <>
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
              onChange: validateUnitOfMeasurementStatus,
              onSubmit: validateUnitOfMeasurementStatus,
            }}
          >
            {(field) => {
              const errorText = getFieldSubmitChangeErrorText(field.state.meta);

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
                  <Radio align="start" value={UNIT_OF_MEASUREMENT_STATUS.DRAFT}>
                    <div className="flex flex-col">
                      Draft
                      <Typography color="text-secondary" variant="caption">
                        Editable only. Cannot be used in supplies or tracked in
                        analytics. Can be activated later
                      </Typography>
                    </div>
                  </Radio>
                  <Radio
                    align="start"
                    value={UNIT_OF_MEASUREMENT_STATUS.ACTIVE}
                  >
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

          <form.Field name="symbol">
            {(field) => {
              const errorText = getFieldSubmitChangeErrorText(field.state.meta);

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
    </>
  );
};
