import {
  Button,
  Dialog,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@ordero/ui';
import {
  WAREHOUSE_STATUS,
  type WarehouseStatus,
} from '@/lib/domain/warehouses';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import {
  validateWarehouseAddress,
  validateWarehouseCode,
  validateWarehouseName,
} from '../../shared/validations';
import type { CreateWarehouseDialogFormContentProps } from './types';
import { validateWarehouseStatus } from './utils/validations';

export const CreateWarehouseDialogFormContent = ({
  form,
}: CreateWarehouseDialogFormContentProps) => (
  <>
    <Dialog.Content>
      <div className="flex flex-col gap-[var(--space-2)]">
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

        <form.Field
          name="status"
          validators={{
            onChange: validateWarehouseStatus,
            onSubmit: validateWarehouseStatus,
          }}
        >
          {(field) => {
            const errorText = getFieldSubmitChangeErrorText(field.state.meta);

            return (
              <RadioGroup
                errorText={errorText}
                invalid={Boolean(errorText)}
                label="Warehouse status"
                name={field.name}
                onValueChange={(value) =>
                  field.handleChange(value as WarehouseStatus)
                }
                orientation="vertical"
                required
                value={field.state.value}
              >
                <Radio align="start" value={WAREHOUSE_STATUS.DRAFT}>
                  <div className="flex flex-col">
                    Draft
                    <Typography color="text-secondary" variant="caption">
                      Editable only. Can be published later
                    </Typography>
                  </div>
                </Radio>
                <Radio align="start" value={WAREHOUSE_STATUS.ACTIVE}>
                  <div className="flex flex-col">
                    Active
                    <Typography color="text-secondary" variant="caption">
                      Fully functional. Cannot be edited after publishing
                    </Typography>
                  </div>
                </Radio>
              </RadioGroup>
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
            state.values.status,
            state.isSubmitting,
          ] as const
        }
      >
        {([code, name, address, status, isSubmitting]) => (
          <Button
            disabled={
              isSubmitting || !code.trim() || !name.trim() || !address.trim()
            }
            type="submit"
          >
            {isSubmitting
              ? status === WAREHOUSE_STATUS.DRAFT
                ? 'Saving...'
                : 'Publishing...'
              : status === WAREHOUSE_STATUS.DRAFT
                ? 'Save draft'
                : 'Publish'}
          </Button>
        )}
      </form.Subscribe>
    </Dialog.Footer>
  </>
);
