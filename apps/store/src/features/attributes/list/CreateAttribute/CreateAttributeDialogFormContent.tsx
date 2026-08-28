import {
  Button,
  Dialog,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@ordero/ui';
import {
  ATTRIBUTE_STATUS,
  ATTRIBUTE_VALUE_STATUS,
} from '@/lib/domain/attributes/constants';
import type { AttributeStatus } from '@/lib/domain/attributes/types';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { CreateAttributeValuesField } from './CreateAttributeValuesField';
import type { CreateAttributeDialogFormContentProps } from './types';
import {
  validateAttributeName,
  validateAttributeStatus,
} from './utils/validations';

export const CreateAttributeDialogFormContent = ({
  form,
  open,
}: CreateAttributeDialogFormContentProps) => {
  const setAttributeValueStatusesToDraft = () => {
    form.setFieldValue(
      'attributeValues',
      form.state.values.attributeValues.map((attributeValue) => ({
        ...attributeValue,
        status: ATTRIBUTE_VALUE_STATUS.DRAFT,
      }))
    );
  };

  return (
    <>
      <Dialog.Content>
        <div className="flex flex-col gap-[var(--space-2)]">
          <form.Field
            name="name"
            validators={{
              onChange: validateAttributeName,
              onSubmit: validateAttributeName,
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
              onChange: validateAttributeStatus,
              onSubmit: validateAttributeStatus,
            }}
          >
            {(field) => {
              const errorText = getFieldSubmitChangeErrorText(field.state.meta);

              return (
                <RadioGroup
                  errorText={errorText}
                  invalid={Boolean(errorText)}
                  label="Attribute status"
                  name={field.name}
                  onValueChange={(value) => {
                    const status = value as AttributeStatus;

                    field.handleChange(status);

                    if (status === ATTRIBUTE_STATUS.DRAFT) {
                      setAttributeValueStatusesToDraft();
                    }
                  }}
                  orientation="vertical"
                  required
                  value={field.state.value}
                >
                  <Radio align="start" value={ATTRIBUTE_STATUS.DRAFT}>
                    <div className="flex flex-col">
                      Draft
                      <Typography color="text-secondary" variant="caption">
                        Editable only. Cannot be assigned to products or tracked
                        in analytics. Can be activated later
                      </Typography>
                    </div>
                  </Radio>
                  <Radio align="start" value={ATTRIBUTE_STATUS.ACTIVE}>
                    <div className="flex flex-col">
                      Active
                      <Typography color="text-secondary" variant="caption">
                        Fully functional. Can be assigned to products and
                        tracked in analytics. Cannot be edited after publishing
                      </Typography>
                    </div>
                  </Radio>
                </RadioGroup>
              );
            }}
          </form.Field>

          <CreateAttributeValuesField form={form} open={open} />
        </div>
      </Dialog.Content>

      <form.Subscribe
        selector={(state) => [state.values.status, state.isSubmitting] as const}
      >
        {([status, isSubmitting]) => (
          <Dialog.Footer closeDisabled={isSubmitting}>
            <Button type="submit">
              {isSubmitting
                ? status === ATTRIBUTE_STATUS.DRAFT
                  ? 'Saving...'
                  : 'Publishing...'
                : status === ATTRIBUTE_STATUS.DRAFT
                  ? 'Save draft'
                  : 'Publish'}
            </Button>
          </Dialog.Footer>
        )}
      </form.Subscribe>
    </>
  );
};
