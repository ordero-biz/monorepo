import { Button, Combobox, FieldHelperText } from '@ordero/ui';
import { useStore } from '@tanstack/react-form';
import { useId, useState } from 'react';
import { AttributesAsyncCombobox } from '@/features/attributes';
import type { AttributeValue } from '@/lib/domain/attributes/types';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { getAttributeValueSelections } from '../../add/CreateProduct';
import { AttributeValuesRow } from '../../shared/ProductAttributeFields';
import type { ProductAttributeValuesFieldProps } from './types';

const getValueId = (value: AttributeValue) => String(value.id);
const getValueLabel = (value: AttributeValue) => value.name;

export const ProductAttributeValuesField = ({
  productVariantsGenerationForm,
}: ProductAttributeValuesFieldProps) => {
  const submissionAttempts = useStore(
    productVariantsGenerationForm.store,
    (state) => state.submissionAttempts
  );
  const fieldId = useId();
  const [isAddingAttribute, setIsAddingAttribute] = useState(false);
  const [focusAttributeId, setFocusAttributeId] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState('');

  return (
    <productVariantsGenerationForm.Field name="attributes">
      {(attributesField) => {
        const attributesError = getFieldSubmitChangeErrorText(
          attributesField.state.meta,
          submissionAttempts
        );
        const attributes = attributesField.state.value;

        return (
          <productVariantsGenerationForm.Field name="attributeValues">
            {(valuesField) => {
              const valuesError = getFieldSubmitChangeErrorText(
                valuesField.state.meta,
                submissionAttempts
              );

              return (
                <fieldset
                  aria-label="Product attributes"
                  className="m-0 flex min-w-0 flex-col gap-[var(--space-2)] border-0 p-0"
                >
                  <output aria-live="polite" className="sr-only">
                    {announcement}
                  </output>
                  {attributes.map((attribute) => {
                    const attributeId = String(attribute.id);
                    const selectedIds =
                      valuesField.state.value[attributeId] ?? [];

                    return (
                      <AttributeValuesRow
                        key={attribute.id}
                        attributeName={attribute.name}
                        inputId={`${fieldId}-${attributeId}-values`}
                        hintId={`${fieldId}-${attributeId}-hint`}
                        empty={selectedIds.length === 0}
                        multiple
                        onRemove={() => {
                          const remainingAttributes = attributes.filter(
                            (item) => item.id !== attribute.id
                          );
                          attributesField.handleChange(remainingAttributes);
                          valuesField.handleChange(
                            getAttributeValueSelections(
                              valuesField.state.value,
                              remainingAttributes
                            )
                          );
                          setAnnouncement(`${attribute.name} removed.`);
                        }}
                      >
                        <div className="min-w-0">
                          <Combobox<AttributeValue>
                            id={`${fieldId}-${attributeId}-values`}
                            aria-label={`${attribute.name} values`}
                            aria-describedby={
                              selectedIds.length === 0
                                ? `${fieldId}-${attributeId}-hint`
                                : undefined
                            }
                            autoFocus={focusAttributeId === attribute.id}
                            emptyText="No values found"
                            getOptionLabel={getValueLabel}
                            getOptionValue={getValueId}
                            invalid={Boolean(valuesError)}
                            multiple
                            name={`attributeValues[${attributeId}]`}
                            onBlur={valuesField.handleBlur}
                            onValueChange={(values) => {
                              valuesField.handleChange({
                                ...valuesField.state.value,
                                [attributeId]: values.map(getValueId),
                              });
                            }}
                            options={attribute.attributeValues}
                            size="s"
                            value={attribute.attributeValues.filter((value) =>
                              selectedIds.includes(String(value.id))
                            )}
                          />
                        </div>
                      </AttributeValuesRow>
                    );
                  })}

                  {isAddingAttribute ? (
                    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-[var(--space-1)]">
                      <label
                        className="col-span-2 text-[length:var(--input-label-size-desktop)] leading-[var(--input-label-line-height-desktop)] font-[var(--input-label-weight)] text-muted-foreground"
                        htmlFor={`${fieldId}-new-attribute`}
                      >
                        Attribute
                      </label>
                      <div className="min-w-0">
                        <AttributesAsyncCombobox
                          aria-label="Attribute"
                          autoFocus
                          defaultOpen
                          name="attributes"
                          size="s"
                          value={null}
                          id={`${fieldId}-new-attribute`}
                          aria-describedby={`${fieldId}-new-attribute-hint`}
                          invalid={Boolean(attributesError)}
                          onValueChange={(attribute) => {
                            if (!attribute) return;
                            if (
                              attributes.some(
                                (item) => item.id === attribute.id
                              )
                            ) {
                              return;
                            }
                            const nextAttributes = [...attributes, attribute];
                            attributesField.handleChange(nextAttributes);
                            valuesField.handleChange(
                              getAttributeValueSelections(
                                valuesField.state.value,
                                nextAttributes
                              )
                            );
                            setIsAddingAttribute(false);
                            setFocusAttributeId(attribute.id);
                            setAnnouncement(
                              `${attribute.name} added. Select its values.`
                            );
                          }}
                          onBlur={attributesField.handleBlur}
                          disabledAttributeIds={attributes.map(
                            (attribute) => attribute.id
                          )}
                        />
                      </div>
                      <Button
                        aria-label="Cancel adding attribute"
                        color="inherit"
                        onClick={() => setIsAddingAttribute(false)}
                        size="s"
                        type="button"
                        variant="text"
                      >
                        Cancel
                      </Button>
                      <div className="col-span-2">
                        <FieldHelperText
                          as="p"
                          id={`${fieldId}-new-attribute-hint`}
                        >
                          Choose an attribute, then select its values
                        </FieldHelperText>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <Button
                        aria-label="Add attribute"
                        onClick={() => setIsAddingAttribute(true)}
                        type="button"
                        variant="text"
                      >
                        + Add attribute
                      </Button>
                    </div>
                  )}
                  {attributesError ? (
                    <FieldHelperText invalid>{attributesError}</FieldHelperText>
                  ) : null}
                  {valuesError ? (
                    <FieldHelperText invalid>{valuesError}</FieldHelperText>
                  ) : null}
                </fieldset>
              );
            }}
          </productVariantsGenerationForm.Field>
        );
      }}
    </productVariantsGenerationForm.Field>
  );
};
