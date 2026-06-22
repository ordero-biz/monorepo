'use client';

import { Button, Dialog, IconButton, TextField, Typography } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { getAttributeDetailRoute } from '@/lib/client/routes';
import { attributesQueryKeys } from '@/lib/hooks/useAttributesQuery';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error';
import { INITIAL_ATTRIBUTE_VALUE_FIELD_INDEX } from './constants';
import { useCreateAttributeForm } from './hooks/useCreateAttributeForm';
import {
  getAttributeValueFieldId,
  getEmptyAttributeValueField,
} from './utils/fields';
import { validateAttributeName } from './utils/validations';

export const CreateAttributeDialog = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const nextAttributeValueFieldIndex = useRef(
    INITIAL_ATTRIBUTE_VALUE_FIELD_INDEX + 1
  );
  const [open, setOpen] = useState(false);

  const { form } = useCreateAttributeForm({
    onCreated: async (attributeId) => {
      setOpen(false);
      await queryClient.invalidateQueries({
        queryKey: attributesQueryKeys.list,
      });
      router.push(getAttributeDetailRoute(attributeId));
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
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
      <Dialog.Trigger>Create Attribute</Dialog.Trigger>

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
                <Dialog.Title>Create new attribute</Dialog.Title>
              </Dialog.Header>

              <Dialog.Content>
                <div className="flex flex-col gap-[var(--space-2)]">
                  <form.Field
                    name="name"
                    validators={{
                      onChange: ({ value }) => validateAttributeName(value),
                      onSubmit: ({ value }) => validateAttributeName(value),
                    }}
                  >
                    {(field) => {
                      const errorText = getFieldSubmitChangeErrorText(
                        field.state.meta
                      );

                      return (
                        <TextField
                          aria-label="Attribute name"
                          errorText={errorText}
                          invalid={Boolean(errorText)}
                          name={field.name}
                          onBlur={field.handleBlur}
                          onValueChange={(value) => field.handleChange(value)}
                          placeholder="Color"
                          required
                          value={field.state.value}
                        />
                      );
                    }}
                  </form.Field>

                  <form.Field name="attributeValues" mode="array">
                    {(field) => (
                      <section className="flex flex-col gap-[var(--space-1-5)] rounded-[var(--radius)] bg-[var(--color-grey-8)] p-[var(--space-1-25)]">
                        <div className="flex flex-col gap-[var(--space-0-5)]">
                          <Typography variant="body1">
                            Attribute values
                          </Typography>

                          {field.state.value.map((attributeValue, index) => {
                            const isLastItem =
                              index === field.state.value.length - 1;
                            const fieldId =
                              attributeValue?.id ??
                              getAttributeValueFieldId(index);

                            return (
                              <div
                                className="flex items-start gap-[var(--space-0-5)]"
                                key={fieldId}
                              >
                                <form.Field
                                  name={
                                    `attributeValues[${index}].value` as const
                                  }
                                >
                                  {(subField) => {
                                    const fieldError =
                                      subField.state.meta.errorMap.onSubmit;
                                    const attributeValue =
                                      subField.state.value ?? '';
                                    const isAddButtonDisabled =
                                      isLastItem && !attributeValue.trim();

                                    return (
                                      <TextField
                                        aria-label={`Attribute value ${index + 1}`}
                                        endAdornment={
                                          <IconButton
                                            aria-label={
                                              isLastItem
                                                ? 'Add attribute value'
                                                : `Remove attribute value ${index + 1}`
                                            }
                                            color="primary"
                                            disabled={isAddButtonDisabled}
                                            onClick={() => {
                                              if (isLastItem) {
                                                if (!attributeValue.trim()) {
                                                  return;
                                                }

                                                field.pushValue(
                                                  createAttributeValue()
                                                );

                                                return;
                                              }

                                              field.removeValue(index);
                                            }}
                                            size="s"
                                            type="button"
                                          >
                                            {isLastItem ? (
                                              <Plus aria-hidden="true" />
                                            ) : (
                                              <Minus aria-hidden="true" />
                                            )}
                                          </IconButton>
                                        }
                                        errorText={fieldError}
                                        invalid={Boolean(fieldError)}
                                        name={subField.name}
                                        onBlur={subField.handleBlur}
                                        onValueChange={(value) =>
                                          subField.handleChange(value)
                                        }
                                        placeholder="Attribute value"
                                        size="s"
                                        value={attributeValue}
                                      />
                                    );
                                  }}
                                </form.Field>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    )}
                  </form.Field>
                </div>
              </Dialog.Content>

              <Dialog.Footer>
                <form.Subscribe
                  selector={(state) =>
                    [state.values.name, state.isSubmitting] as const
                  }
                >
                  {([name, isSubmitting]) => (
                    <Button
                      disabled={
                        Boolean(validateAttributeName(name)) || isSubmitting
                      }
                      type="submit"
                    >
                      Create
                    </Button>
                  )}
                </form.Subscribe>
              </Dialog.Footer>
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
