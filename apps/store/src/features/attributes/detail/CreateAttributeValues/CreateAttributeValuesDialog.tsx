'use client';

import { Button, Dialog, IconButton, TextField, Typography } from '@ordero/ui';
import { useQueryClient } from '@tanstack/react-query';
import { Minus, Plus } from 'lucide-react';
import { useRef } from 'react';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { INITIAL_ATTRIBUTE_VALUE_FIELD_INDEX } from './constants';
import { useCreateAttributeValuesForm } from './hooks/useCreateAttributeValuesForm';
import type { CreateAttributeValuesDialogProps } from './types';
import {
  getAttributeValueFieldId,
  getEmptyAttributeValueField,
} from './utils/fields';
import { validateAttributeValues } from './utils/validations';

export const CreateAttributeValuesDialog = ({
  attributeId,
  onOpenChange,
  open,
}: CreateAttributeValuesDialogProps) => {
  const queryClient = useQueryClient();
  const nextAttributeValueFieldIndex = useRef(
    INITIAL_ATTRIBUTE_VALUE_FIELD_INDEX + 1
  );
  const { form } = useCreateAttributeValuesForm({
    attributeId,
    onAdded: async () => {
      onOpenChange(false);
      await queryClient.invalidateQueries({
        queryKey: attributesQueryKeys.values(attributeId),
      });
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

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
                <form.Field
                  name="attributeValues"
                  mode="array"
                  validators={{
                    onChange: validateAttributeValues,
                    onSubmit: validateAttributeValues,
                  }}
                >
                  {(field) => {
                    const errorText = getFieldSubmitChangeErrorText(
                      field.state.meta
                    );

                    return (
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
                                      getFieldSubmitChangeErrorText(
                                        subField.state.meta
                                      );
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
                                        onValueChange={subField.handleChange}
                                        size="s"
                                        value={attributeValue}
                                      />
                                    );
                                  }}
                                </form.Field>
                              </div>
                            );
                          })}
                          {errorText && (
                            <Typography color="error" variant="caption">
                              {errorText}
                            </Typography>
                          )}
                        </div>
                      </section>
                    );
                  }}
                </form.Field>
              </Dialog.Content>

              <Dialog.Footer>
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
                      <Button
                        disabled={isSubmitting || !hasAttributeValue}
                        type="submit"
                      >
                        {isSubmitting ? 'Adding...' : 'Add'}
                      </Button>
                    );
                  }}
                </form.Subscribe>
              </Dialog.Footer>
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
