import { Button, Combobox, FieldHelperText } from '@ordero/ui';
import { useStore } from '@tanstack/react-form';
import { useId, useState } from 'react';
import type { AttributeValue } from '@/lib/domain/attributes/types';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { getAttributeValueSelections } from '../../add/CreateProduct';
import { AttributesAsyncCombobox } from './AttributesAsyncCombobox';
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
                      <section
                        aria-labelledby={`attribute-${attributeId}-heading`}
                        className={`grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-[var(--space-1)] rounded-[var(--radius)] border border-border p-[var(--space-1-5)] transition-colors md:grid-cols-[var(--space-18)_minmax(0,1fr)_auto] ${selectedIds.length === 0 ? 'bg-[var(--color-primary-8)]' : 'bg-card'}`}
                        key={attribute.id}
                      >
                        <h4
                          className="col-span-2 min-w-0 break-words font-semibold md:col-span-1"
                          id={`attribute-${attributeId}-heading`}
                        >
                          <label
                            className="cursor-pointer"
                            htmlFor={`${fieldId}-${attributeId}-values`}
                          >
                            {attribute.name}
                          </label>
                        </h4>
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
                        <Button
                          aria-label={`Remove ${attribute.name} attribute`}
                          color="inherit"
                          onClick={() => {
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
                          size="s"
                          type="button"
                          variant="text"
                        >
                          Remove
                        </Button>
                        {selectedIds.length === 0 ? (
                          <div className="col-span-2 md:col-span-1 md:col-start-2">
                            <FieldHelperText
                              as="p"
                              id={`${fieldId}-${attributeId}-hint`}
                            >
                              Choose one or more {attribute.name.toLowerCase()}{' '}
                              values
                            </FieldHelperText>
                          </div>
                        ) : null}
                      </section>
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
                          id={`${fieldId}-new-attribute`}
                          aria-describedby={`${fieldId}-new-attribute-hint`}
                          invalid={Boolean(attributesError)}
                          onAttributeSelected={(attribute) => {
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
                          selectedAttributes={attributes}
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
