'use client';

import { Button, Dialog, IconButton, TextField } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { Minus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getAttributeDetailRoute } from '@/lib/client/routes';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { INITIAL_ATTRIBUTE_VALUE_FIELD_INDEX } from './constants';
import { useCreateAttributeForm } from './hooks/useCreateAttributeForm';
import type { CreateAttributeDialogProps } from './types';
import {
  getAttributeValueFieldId,
  getEmptyAttributeValueField,
} from './utils/fields';
import { validateAttributeName } from './utils/validations';

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
                        />
                      );
                    }}
                  </form.Field>

                  <form.Subscribe selector={(state) => state.isSubmitting}>
                    {(isSubmitting) => (
                      <form.Field name="attributeValues" mode="array">
                        {(field) => (
                          <div className="flex flex-col gap-[var(--space-0-5)]">
                            {field.state.value.map(
                              (attributeValue, index) => {
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
                                                subField.handleChange(
                                                  subField.state.value
                                                );
                                              }}
                                              onValueChange={
                                                subField.handleChange
                                              }
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
                                              disabled={isSubmitting}
                                              onClick={() => {
                                                const newAttributeValue =
                                                  createAttributeValue();

                                                setAutoFocusAttributeValueId(
                                                  newAttributeValue.id
                                                );
                                                field.pushValue(
                                                  newAttributeValue
                                                );
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
                              }
                            )}
                          </div>
                        )}
                      </form.Field>
                    )}
                  </form.Subscribe>
                </div>
              </Dialog.Content>

              <form.Subscribe
                selector={(state) =>
                  [state.values.name, state.isSubmitting] as const
                }
              >
                {([name, isSubmitting]) => (
                  <Dialog.Footer closeDisabled={isSubmitting}>
                    <Button
                      disabled={isSubmitting || !name.trim()}
                      type="submit"
                    >
                      {isSubmitting ? 'Adding...' : 'Add'}
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
