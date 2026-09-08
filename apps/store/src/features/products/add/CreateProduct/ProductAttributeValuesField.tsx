import { FieldHelperText, ToggleButton } from '@ordero/ui';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import type { ProductAttributeValuesFieldProps } from './types';
import { updateAttributeValueSelection } from './utils/productGeneration';

export const ProductAttributeValuesField = ({
  productVariantsGenerationForm,
}: ProductAttributeValuesFieldProps) => (
  <productVariantsGenerationForm.Field name="attributeValues">
    {(field) => {
      const errorText = getFieldSubmitChangeErrorText(field.state.meta);

      return (
        <productVariantsGenerationForm.Subscribe
          selector={(state) => state.values.attributes}
        >
          {(attributes) =>
            attributes.length > 0 ? (
              <fieldset
                aria-label="Attribute values"
                className="m-0 flex flex-col gap-[var(--space-2)] border-0 p-0"
              >
                {attributes.map((attribute) => {
                  const attributeId = String(attribute.id);
                  const selectedAttributeValueIds =
                    field.state.value[attributeId] ?? [];

                  return (
                    <div
                      className="flex flex-wrap items-center gap-[var(--space-1)]"
                      key={attribute.id}
                    >
                      <span className="font-medium text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)]">
                        {attribute.name}:
                      </span>
                      {attribute.attributeValues.map((attributeValue) => {
                        const attributeValueId = String(attributeValue.id);

                        return (
                          <ToggleButton.Item
                            key={attributeValue.id}
                            onPressedChange={(pressed) => {
                              field.handleChange(
                                updateAttributeValueSelection({
                                  attributeId,
                                  attributeValueId,
                                  attributeValuesByAttributeId:
                                    field.state.value,
                                  pressed,
                                })
                              );
                            }}
                            pressed={selectedAttributeValueIds.includes(
                              attributeValueId
                            )}
                            size="s"
                            type="button"
                          >
                            {attributeValue.name}
                          </ToggleButton.Item>
                        );
                      })}
                    </div>
                  );
                })}
                {errorText ? (
                  <FieldHelperText invalid>{errorText}</FieldHelperText>
                ) : null}
              </fieldset>
            ) : null
          }
        </productVariantsGenerationForm.Subscribe>
      );
    }}
  </productVariantsGenerationForm.Field>
);
