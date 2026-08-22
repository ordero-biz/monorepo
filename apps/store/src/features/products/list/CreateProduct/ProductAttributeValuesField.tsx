import { ToggleButton } from '@ordero/ui';
import type { ProductAttributeValuesFieldProps } from './types';

export const ProductAttributeValuesField = ({
  form,
}: ProductAttributeValuesFieldProps) => (
  <form.Field name="attributeValues">
    {(field) => (
      <form.Subscribe selector={(state) => state.values.attributes}>
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
                            const nextAttributeValues = {
                              ...field.state.value,
                              [attributeId]: pressed
                                ? [
                                    ...selectedAttributeValueIds,
                                    attributeValueId,
                                  ]
                                : selectedAttributeValueIds.filter(
                                    (selectedAttributeValueId) =>
                                      selectedAttributeValueId !==
                                      attributeValueId
                                  ),
                            };

                            field.handleChange(nextAttributeValues);
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
            </fieldset>
          ) : null
        }
      </form.Subscribe>
    )}
  </form.Field>
);
