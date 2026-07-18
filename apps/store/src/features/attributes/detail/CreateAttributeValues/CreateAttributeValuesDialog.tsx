'use client';

import { Button, Dialog, IconButton, TextField } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { Minus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { INITIAL_ATTRIBUTE_VALUE_FIELD_INDEX } from './constants';
import { useCreateAttributeValuesForm } from './hooks/useCreateAttributeValuesForm';
import type { CreateAttributeValuesDialogProps } from './types';
import {
  getAttributeValueFieldId,
  getEmptyAttributeValueField,
} from './utils/fields';
import { validateAttributeValueName } from './utils/validations';

export const CreateAttributeValuesDialog = ({
  attributeId,
  onOpenChange,
  open,
}: CreateAttributeValuesDialogProps) => {
  const queryClient = useQueryClient();
  const nextAttributeValueFieldIndex = useRef(
    INITIAL_ATTRIBUTE_VALUE_FIELD_INDEX + 1
  );
  const [autoFocusAttributeValueId, setAutoFocusAttributeValueId] =
    useState<string>();
  const { form } = useCreateAttributeValuesForm({
    attributeId,
    onAdded: async () => {
      onOpenChange(false);
      await queryClient.invalidateQueries({
        queryKey: attributesQueryKeys.values(attributeId),
      });
    },
  });

  useEffect(() => {
    if (!autoFocusAttributeValueId) {
      return;
    }

    const timeoutId = setTimeout(() => {
      document.getElementById(autoFocusAttributeValueId)?.focus();
    });

    return () => clearTimeout(timeoutId);
  }, [autoFocusAttributeValueId]);

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      setAutoFocusAttributeValueId(undefined);
      form.reset();
    }
  };

  const createAttributeValue = () => {
    const attributeValue = getEmptyAttributeValueField(
      nextAttributeValueFieldIndex.current
    );

    nextAttributeValueFieldIndex.current += 1;

    return attributeValue;
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
                <Dialog.Title>Add attribute values</Dialog.Title>
              </Dialog.Header>

              <Dialog.Content>
                <form.Subscribe selector={(state) => state.isSubmitting}>
                  {(isSubmitting) => (
                    <form.Field name="attributeValues" mode="array">
                      {(field) => (
                        <div className="flex flex-col gap-[var(--space-0-5)]">
                          {field.state.value.map((attributeValue, index) => {
                            const isLastItem =
                              index === field.state.value.length - 1;
                            const fieldId =
                              attributeValue?.id ??
                              getAttributeValueFieldId(index);

                            return (
                              <form.Field
                                key={fieldId}
                                name={
                                  `attributeValues[${index}].value` as const
                                }
                                validators={{
                                  onChange: validateAttributeValueName,
                                  onSubmit: validateAttributeValueName,
                                }}
                              >
                                {(subField) => {
                                  const fieldError =
                                    getFieldSubmitChangeErrorText(
                                      subField.state.meta
                                    );
                                  const attributeValue =
                                    subField.state.value ?? '';

                                  return (
                                    <>
                                      <div className="flex items-start gap-[var(--space-0-5)]">
                                        <TextField
                                          aria-label={`Attribute value ${index + 1}`}
                                          disabled={isSubmitting}
                                          errorText={fieldError}
                                          id={fieldId}
                                          invalid={Boolean(fieldError)}
                                          name={subField.name}
                                          onBlur={() => {
                                            subField.handleBlur();

                                            if (attributeValue) {
                                              subField.handleChange(
                                                subField.state.value
                                              );
                                            }
                                          }}
                                          onValueChange={subField.handleChange}
                                          size="s"
                                          value={attributeValue}
                                        />
                                        {field.state.value.length > 1 && (
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
                                        {isLastItem && (
                                          <Button
                                            disabled={
                                              isSubmitting ||
                                              !attributeValue.trim()
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
                                      )}
                                    </>
                                  );
                                }}
                              </form.Field>
                            );
                          })}
                        </div>
                      )}
                    </form.Field>
                  )}
                </form.Subscribe>
              </Dialog.Content>

              <form.Subscribe
                selector={(state) =>
                  [state.values.attributeValues, state.isSubmitting] as const
                }
              >
                {([attributeValues, isSubmitting]) => {
                  const hasAttributeValue = attributeValues.some(
                    (attributeValue) => attributeValue.value.trim()
                  );

                  return (
                    <Dialog.Footer closeDisabled={isSubmitting}>
                      <Button
                        disabled={isSubmitting || !hasAttributeValue}
                        type="submit"
                      >
                        {isSubmitting ? 'Saving...' : 'Save'}
                      </Button>
                    </Dialog.Footer>
                  );
                }}
              </form.Subscribe>
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
