import { Button, Dialog, TextField } from '@ordero/ui';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import {
  validateWarehouseAddress,
  validateWarehouseCode,
  validateWarehouseName,
} from '../../shared/validations';
import type { UpdateWarehouseFormDialogContentProps } from './types';

export const UpdateWarehouseFormDialogContent = ({
  form,
}: UpdateWarehouseFormDialogContentProps) => (
  <>
    <Dialog.Content>
      <div className="flex flex-col gap-[var(--space-2)]">
        <form.Field
          name="code"
          validators={{
            onChange: validateWarehouseCode,
            onSubmit: validateWarehouseCode,
          }}
        >
          {(field) => {
            const errorText = getFieldSubmitChangeErrorText(field.state.meta);

            return (
              <TextField
                errorText={errorText}
                invalid={Boolean(errorText)}
                label="Code"
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
          name="name"
          validators={{
            onChange: validateWarehouseName,
            onSubmit: validateWarehouseName,
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
          name="address"
          validators={{
            onChange: validateWarehouseAddress,
            onSubmit: validateWarehouseAddress,
          }}
        >
          {(field) => {
            const errorText = getFieldSubmitChangeErrorText(field.state.meta);

            return (
              <TextField
                errorText={errorText}
                invalid={Boolean(errorText)}
                label="Address"
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
            state.values.code,
            state.values.name,
            state.values.address,
            state.isSubmitting,
          ] as const
        }
      >
        {([code, name, address, isSubmitting]) => (
          <Button
            disabled={
              isSubmitting || !code.trim() || !name.trim() || !address.trim()
            }
            type="submit"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        )}
      </form.Subscribe>
    </Dialog.Footer>
  </>
);
