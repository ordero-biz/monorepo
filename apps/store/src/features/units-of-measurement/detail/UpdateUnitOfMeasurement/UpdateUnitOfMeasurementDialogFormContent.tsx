import { Button, Dialog, TextField } from '@ordero/ui';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { validateUnitOfMeasurementName } from '../../shared/validations';
import type { UpdateUnitOfMeasurementDialogFormContentProps } from './types';

export const UpdateUnitOfMeasurementDialogFormContent = ({
  form,
  isUnitOfMeasurementActive,
}: UpdateUnitOfMeasurementDialogFormContentProps) => {
  return (
    <>
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
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          )}
        </form.Subscribe>
      </Dialog.Footer>
    </>
  );
};
