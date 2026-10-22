import { Button, Combobox, FieldHelperText, IconButton } from '@ordero/ui';
import { X } from 'lucide-react';
import { useState } from 'react';
import type { AttributeValue } from '@/lib/domain/attributes/types';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import {
  getAttributeValueSelections,
  PRODUCT_GENERATION_MODE,
  validateProductAttributes,
} from '../../add/CreateProduct';
import { AttributesAsyncCombobox } from './AttributesAsyncCombobox';
import type { ProductAttributeValuesFieldProps } from './types';

const getValueId = (value: AttributeValue) => String(value.id);
const getValueLabel = (value: AttributeValue) => value.name;

export const ProductAttributeValuesField = ({
  generationMode,
  productVariantsGenerationForm,
}: ProductAttributeValuesFieldProps) => {
  const [isAddingAttribute, setIsAddingAttribute] = useState(false);
  const requiresAttributes = generationMode === PRODUCT_GENERATION_MODE.many;

  return (
    <productVariantsGenerationForm.Field
      name="attributes"
      validators={
        requiresAttributes
          ? {
              onChange: validateProductAttributes,
              onSubmit: validateProductAttributes,
            }
          : undefined
      }
    >
      {(attributesField) => {
        const attributesError = getFieldSubmitChangeErrorText(
          attributesField.state.meta
        );
        const attributes = attributesField.state.value;

        return (
          <productVariantsGenerationForm.Field name="attributeValues">
            {(valuesField) => {
              const valuesError = getFieldSubmitChangeErrorText(
                valuesField.state.meta
              );

              return (
                <fieldset
                  aria-label="Product attributes"
                  className="m-0 flex min-w-0 flex-col gap-[var(--space-2)] border-0 p-0"
                >
                  {attributes.map((attribute) => {
                    const attributeId = String(attribute.id);
                    const selectedIds =
                      valuesField.state.value[attributeId] ?? [];

                    return (
                      <div
                        className="flex min-w-0 items-end gap-[var(--space-1)]"
                        key={attribute.id}
                      >
                        <div className="min-w-0 flex-1">
                          <Combobox<AttributeValue>
                            emptyText="No values found"
                            getOptionLabel={getValueLabel}
                            getOptionValue={getValueId}
                            invalid={Boolean(valuesError)}
                            label={attribute.name}
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
                            placeholder="Select values"
                            size="s"
                            value={attribute.attributeValues.filter((value) =>
                              selectedIds.includes(String(value.id))
                            )}
                          />
                        </div>
                        <IconButton
                          aria-label={`Remove ${attribute.name} attribute`}
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
                          }}
                          size="m"
                          type="button"
                        >
                          <X aria-hidden="true" />
                        </IconButton>
                      </div>
                    );
                  })}

                  {isAddingAttribute ? (
                    <div className="flex min-w-0 items-end gap-[var(--space-1)]">
                      <div className="min-w-0 flex-1">
                        <AttributesAsyncCombobox
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
                          }}
                          onBlur={attributesField.handleBlur}
                          selectedAttributes={attributes}
                        />
                      </div>
                      <IconButton
                        aria-label="Cancel adding attribute"
                        onClick={() => setIsAddingAttribute(false)}
                        size="m"
                        type="button"
                      >
                        <X aria-hidden="true" />
                      </IconButton>
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
