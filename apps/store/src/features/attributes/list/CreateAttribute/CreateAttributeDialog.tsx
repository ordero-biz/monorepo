'use client';

import {
  Button,
  Dialog,
  IconButton,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { CircleAlert, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getAttributeDetailRoute } from '@/lib/client/routes';
import { ATTRIBUTE_STATUS } from '@/lib/domain/attributes/constants';
import type { AttributeStatus } from '@/lib/domain/attributes/types';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import {
  ATTRIBUTE_VALUE_STATUS_OPTIONS,
  INITIAL_ATTRIBUTE_VALUE_FIELD_INDEX,
} from './constants';
import { useCreateAttributeForm } from './hooks/useCreateAttributeForm';
import type { CreateAttributeDialogProps } from './types';
import {
  getAttributeValueFieldId,
  getEmptyAttributeValueField,
} from './utils/fields';
import {
  validateAttributeName,
  validateAttributeStatus,
  validateAttributeValueStatus,
} from './utils/validations';

export const CreateAttributeDialog = ({
  onOpenChange,
  open,
}: CreateAttributeDialogProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const nextAttributeValueFieldIndex = useRef(
    INITIAL_ATTRIBUTE_VALUE_FIELD_INDEX + 1
  );
  const [autoFocusAttributeValueId, setAutoFocusAttributeValueId] =
    useState<string>();

  const { form } = useCreateAttributeForm({
    onCreated: async (attributeId) => {
      onOpenChange(false);
      await queryClient.invalidateQueries({
        queryKey: attributesQueryKeys.list,
      });
      router.push(getAttributeDetailRoute(attributeId));
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      setAutoFocusAttributeValueId(undefined);
      form.reset();
    }
  };

  useEffect(() => {
    if (!autoFocusAttributeValueId) {
      return;
    }

    const timeoutId = setTimeout(() => {
      document.getElementById(autoFocusAttributeValueId)?.focus();
    });

    return () => clearTimeout(timeoutId);
  }, [autoFocusAttributeValueId]);

  const createAttributeValue = () => {
    const attributeValue = getEmptyAttributeValueField(
      nextAttributeValueFieldIndex.current
    );

    nextAttributeValueFieldIndex.current += 1;

    return attributeValue;
  };

  const setAttributeValueStatusesToDraft = () => {
    form.setFieldValue(
      'attributeValues',
      form.state.values.attributeValues.map((attributeValue) => ({
        ...attributeValue,
        status: ATTRIBUTE_STATUS.DRAFT,
      }))
    );
  };

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup size="sm">
            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                form.handleSubmit();
              }}
            >
              <Dialog.Header>
                <Dialog.Title>Add new attribute</Dialog.Title>
              </Dialog.Header>

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
                          value={field.state.value}
                          size="s"
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
                      const errorText = getFieldSubmitChangeErrorText(
                        field.state.meta
                      );

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
                              <Typography
                                color="text-secondary"
                                variant="caption"
                              >
                                Editable only. Cannot be assigned to products or
                                tracked in analytics. Can be activated later
                              </Typography>
                            </div>
                          </Radio>
                          <Radio align="start" value={ATTRIBUTE_STATUS.ACTIVE}>
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

                  <form.Subscribe
                    selector={(state) =>
                      [state.isSubmitting, state.values.status] as const
                    }
                  >
                    {([isSubmitting, attributeStatus]) => (
                      <>
                        <form.Field name="attributeValues" mode="array">
                          {(field) => {
                            const lastAttributeValue =
                              field.state.value[field.state.value.length - 1]
                                ?.value ?? '';

                            return (
                              <>
                                <div className="flex flex-col gap-[var(--space-0-5)]">
                                  {field.state.value.map(
                                    (attributeValue, index) => {
                                      const fieldId =
                                        attributeValue?.id ??
                                        getAttributeValueFieldId(index);

                                      return (
                                        <form.Field
                                          key={fieldId}
                                          name={
                                            `attributeValues[${index}].value` as const
                                          }
                                        >
                                          {(subField) => {
                                            const fieldError =
                                              getFieldSubmitChangeErrorText(
                                                subField.state.meta
                                              );
                                            const attributeValue =
                                              subField.state.value ?? '';

                                            return (
                                              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.5fr)_auto] items-end gap-[var(--space-0-5)]">
                                                <TextField
                                                  aria-label={`Attribute value ${index + 1}`}
                                                  disabled={isSubmitting}
                                                  errorText={fieldError}
                                                  id={fieldId}
                                                  invalid={Boolean(fieldError)}
                                                  label={
                                                    index === 0
                                                      ? 'Attribute values'
                                                      : undefined
                                                  }
                                                  name={subField.name}
                                                  onBlur={subField.handleBlur}
                                                  onValueChange={
                                                    subField.handleChange
                                                  }
                                                  size="s"
                                                  value={attributeValue}
                                                />
                                                <form.Field
                                                  name={
                                                    `attributeValues[${index}].status` as const
                                                  }
                                                  validators={{
                                                    onChange:
                                                      validateAttributeValueStatus,
                                                    onSubmit:
                                                      validateAttributeValueStatus,
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
                                                        invalid={Boolean(
                                                          errorText
                                                        )}
                                                        name={statusField.name}
                                                        onBlur={
                                                          statusField.handleBlur
                                                        }
                                                        onValueChange={(
                                                          value
                                                        ) =>
                                                          statusField.handleChange(
                                                            value as AttributeStatus
                                                          )
                                                        }
                                                        options={
                                                          ATTRIBUTE_VALUE_STATUS_OPTIONS
                                                        }
                                                        required
                                                        size="s"
                                                        value={
                                                          statusField.state
                                                            .value
                                                        }
                                                      />
                                                    );
                                                  }}
                                                </form.Field>
                                                {field.state.value.length >
                                                  1 && (
                                                  <div className="flex h-[var(--textfield-outlined-sm-height)] items-center">
                                                    <IconButton
                                                      aria-label={`Remove attribute value ${index + 1}`}
                                                      color="default"
                                                      disabled={isSubmitting}
                                                      onClick={() =>
                                                        field.removeValue(index)
                                                      }
                                                      size="xs"
                                                      type="button"
                                                      variant="soft"
                                                    >
                                                      <Minus aria-hidden="true" />
                                                    </IconButton>
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          }}
                                        </form.Field>
                                      );
                                    }
                                  )}
                                </div>
                                <Button
                                  disabled={
                                    isSubmitting || !lastAttributeValue.trim()
                                  }
                                  onClick={() => {
                                    const newAttributeValue =
                                      createAttributeValue();

                                    setAutoFocusAttributeValueId(
                                      newAttributeValue.id
                                    );
                                    field.pushValue(newAttributeValue);
                                  }}
                                  type="button"
                                  variant="text"
                                >
                                  + Add another value
                                </Button>
                                {attributeStatus === ATTRIBUTE_STATUS.DRAFT ? (
                                  <div className="flex items-center gap-[var(--space-0-5)] text-[var(--text-primary)]">
                                    <CircleAlert
                                      aria-hidden="true"
                                      className="size-[var(--form-helper-text-icon)] shrink-0"
                                    />
                                    <Typography
                                      color="text-primary"
                                      variant="caption"
                                    >
                                      Attribute values cannot be active while
                                      the attribute is a draft
                                    </Typography>
                                  </div>
                                ) : null}
                              </>
                            );
                          }}
                        </form.Field>
                      </>
                    )}
                  </form.Subscribe>
                </div>
              </Dialog.Content>

              <form.Subscribe
                selector={(state) =>
                  [state.values.status, state.isSubmitting] as const
                }
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
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
