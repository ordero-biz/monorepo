import {
  Button,
  Dialog,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@ordero/ui';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import type { WarehouseStatus } from '@/lib/domain/warehouses/types';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { validateWarehouseName } from '../../shared/validations';
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
                      Editable only. Cannot be used in supplies or tracked in
                      analytics. Can be activated later
                    </Typography>
                  </div>
                </Radio>
                <Radio align="start" value={WAREHOUSE_STATUS.ACTIVE}>
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

        <form.Field name="address">
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
                value={field.state.value}
              />
            );
          }}
        </form.Field>
      </div>
    </Dialog.Content>

    <Dialog.Footer>
      <form.Subscribe
        selector={(state) => [state.isSubmitting, state.values.status] as const}
      >
        {([isSubmitting, status]) => (
          <Button disabled={isSubmitting} type="submit">
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
