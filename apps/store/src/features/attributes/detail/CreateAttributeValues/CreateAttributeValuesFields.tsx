import { Button, IconButton, Select, TextField, Typography } from '@ordero/ui';
import { CircleAlert, Minus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ATTRIBUTE_STATUS } from '@/lib/domain/attributes/constants';
import type { AttributeValueStatus } from '@/lib/domain/attributes/types';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import {
  ATTRIBUTE_VALUE_STATUS_OPTIONS,
  INITIAL_ATTRIBUTE_VALUE_FIELD_INDEX,
} from './constants';
import type { CreateAttributeValuesFieldsProps } from './types';
import {
  getAttributeValueFieldId,
  getEmptyAttributeValueField,
} from './utils/fields';
import {
  validateAttributeValueName,
  validateAttributeValueStatus,
} from './utils/validations';

export const CreateAttributeValuesFields = ({
  attributeStatus,
  form,
  open,
}: CreateAttributeValuesFieldsProps) => {
  const nextAttributeValueFieldIndex = useRef(
    INITIAL_ATTRIBUTE_VALUE_FIELD_INDEX + 1
  );
  const [autoFocusAttributeValueId, setAutoFocusAttributeValueId] =
    useState<string>();

  useEffect(() => {
    if (!open) {
      setAutoFocusAttributeValueId(undefined);
    }
  }, [open]);

  useEffect(() => {
    if (!autoFocusAttributeValueId || !open) {
      return;
    }

    const timeoutId = setTimeout(() => {
      document.getElementById(autoFocusAttributeValueId)?.focus();
    });

    return () => clearTimeout(timeoutId);
  }, [autoFocusAttributeValueId, open]);

  const createAttributeValue = () => {
    const attributeValue = getEmptyAttributeValueField(
      nextAttributeValueFieldIndex.current
    );

    nextAttributeValueFieldIndex.current += 1;

    return attributeValue;
  };

  return (
    <form.Subscribe
      selector={(state) =>
        [state.isSubmitting, state.values.attributeValues] as const
      }
    >
      {([isSubmitting, attributeValues]) => {
        const lastAttributeValue =
          attributeValues[attributeValues.length - 1]?.value ?? '';

        return (
          <>
            <form.Field name="attributeValues" mode="array">
              {(field) => (
                <>
                  <div className="flex flex-col gap-[var(--space-0-5)]">
                    {field.state.value.map((attributeValue, index) => {
                      const fieldId =
                        attributeValue?.id ?? getAttributeValueFieldId(index);

                      return (
                        <form.Field
                          key={fieldId}
                          name={`attributeValues[${index}].value` as const}
                          validators={{
                            onChange: validateAttributeValueName,
                            onSubmit: validateAttributeValueName,
                          }}
                        >
                          {(subField) => {
                            const fieldError = getFieldSubmitChangeErrorText(
                              subField.state.meta
                            );
                            const value = subField.state.value ?? '';

                            return (
                              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.5fr)_auto] items-end gap-[var(--space-0-5)]">
                                <TextField
                                  aria-label={`Attribute value ${index + 1}`}
                                  disabled={isSubmitting}
                                  errorText={fieldError}
                                  id={fieldId}
                                  invalid={Boolean(fieldError)}
                                  label={
                                    index === 0 ? 'Attribute values' : undefined
                                  }
                                  name={subField.name}
                                  onBlur={() => {
                                    subField.handleBlur();

                                    if (value) {
                                      subField.handleChange(
                                        subField.state.value
                                      );
                                    }
                                  }}
                                  onValueChange={subField.handleChange}
                                  size="s"
                                  value={value}
                                />
                                <form.Field
                                  name={
                                    `attributeValues[${index}].status` as const
                                  }
                                  validators={{
                                    onChange: validateAttributeValueStatus,
                                    onSubmit: validateAttributeValueStatus,
                                  }}
                                >
                                  {(statusField) => {
                                    const errorText =
                                      getFieldSubmitChangeErrorText(
                                        statusField.state.meta
                                      );

                                    return (
                                      <Select
                                        aria-label={`Attribute value status ${index + 1}`}
                                        disabled={
                                          isSubmitting ||
                                          attributeStatus ===
                                            ATTRIBUTE_STATUS.DRAFT
                                        }
                                        errorText={errorText}
                                        invalid={Boolean(errorText)}
                                        name={statusField.name}
                                        onBlur={statusField.handleBlur}
                                        onValueChange={(nextStatus) =>
                                          statusField.handleChange(
                                            nextStatus as AttributeValueStatus
                                          )
                                        }
                                        options={ATTRIBUTE_VALUE_STATUS_OPTIONS}
                                        required
                                        size="s"
                                        value={statusField.state.value}
                                      />
                                    );
                                  }}
                                </form.Field>
                                {field.state.value.length > 1 ? (
                                  <div className="flex h-[var(--textfield-outlined-sm-height)] items-center">
                                    <IconButton
                                      aria-label={`Remove attribute value ${index + 1}`}
                                      color="default"
                                      disabled={isSubmitting}
                                      onClick={() => field.removeValue(index)}
                                      size="xs"
                                      type="button"
                                      variant="soft"
                                    >
                                      <Minus aria-hidden="true" />
                                    </IconButton>
                                  </div>
                                ) : null}
                              </div>
                            );
                          }}
                        </form.Field>
                      );
                    })}
                  </div>
                  <Button
                    disabled={isSubmitting || !lastAttributeValue.trim()}
                    onClick={() => {
                      const attributeValue = createAttributeValue();

                      setAutoFocusAttributeValueId(attributeValue.id);
                      field.pushValue(attributeValue);
                    }}
                    type="button"
                    variant="text"
                  >
                    + Add another value
                  </Button>
                </>
              )}
            </form.Field>
            {attributeStatus === ATTRIBUTE_STATUS.DRAFT ? (
              <div className="flex items-center gap-[var(--space-0-5)] text-[var(--text-primary)]">
                <CircleAlert
                  aria-hidden="true"
                  className="size-[var(--form-helper-text-icon)] shrink-0"
                />
                <Typography color="text-primary" variant="caption">
                  Attribute values cannot be active while the attribute is a
                  draft
                </Typography>
              </div>
            ) : null}
          </>
        );
      }}
    </form.Subscribe>
  );
};
