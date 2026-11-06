import {
  Button,
  Combobox,
  Dialog,
  FieldHelperText,
  IconButton,
  Typography,
} from '@ordero/ui';
import { X } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { AttributesAsyncCombobox } from '@/features/attributes';
import type {
  AttributeDropdown,
  AttributeValue,
} from '@/lib/domain/attributes/types';
import { AttributeValuesRow } from '../../shared/ProductAttributeFields';
import type { EditProductVariantAttributesDialogProps } from './types';

const getValueId = (value: AttributeValue) => String(value.id);
const getValueLabel = (value: AttributeValue) => value.name;

export const EditProductVariantAttributesDialog = ({
  allowMultipleValuesPerAttribute,
  attributes,
  attributeValueIds,
  onOpenChange,
  onUpdate,
  open,
  productVariantName,
}: EditProductVariantAttributesDialogProps) => {
  const [selectedAttributeValueIds, setSelectedAttributeValueIds] = useState<
    number[]
  >([]);

  const fieldId = useId();
  const [selectedAttributes, setSelectedAttributes] = useState(attributes);
  const [isAddingAttribute, setIsAddingAttribute] = useState(false);
  const [focusAttributeId, setFocusAttributeId] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (open) {
      setSelectedAttributeValueIds(attributeValueIds);
      setSelectedAttributes(attributes);
      setIsAddingAttribute(false);
      setFocusAttributeId(null);
      setAnnouncement('');
    }
  }, [attributeValueIds, attributes, open]);

  const updateAttributeValues = (
    attribute: AttributeDropdown,
    values: AttributeValue[]
  ) => {
    const attributeIds = new Set(
      attribute.attributeValues.map((value) => value.id)
    );
    setSelectedAttributeValueIds((currentIds) => [
      ...currentIds.filter((id) => !attributeIds.has(id)),
      ...values.map((value) => value.id),
    ]);
  };

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup size="md">
            <Dialog.Header>
              <Dialog.Title>Edit attributes</Dialog.Title>
              <Typography variant="body2">{productVariantName}</Typography>
              <Dialog.Description>
                Changes apply only to this variant.
              </Dialog.Description>
            </Dialog.Header>

            <Dialog.Content scrollable>
              <fieldset
                aria-label="Variant attribute values"
                className="m-0 flex min-w-0 flex-col gap-[var(--space-2)] border-0 p-0"
              >
                <output aria-live="polite" className="sr-only">
                  {announcement}
                </output>
                {selectedAttributes.map((attribute) => {
                  const selectedValues = attribute.attributeValues.filter(
                    (value) => selectedAttributeValueIds.includes(value.id)
                  );

                  const inputId = `${fieldId}-${attribute.id}-values`;
                  const hintId = `${fieldId}-${attribute.id}-hint`;

                  return (
                    <AttributeValuesRow
                      key={attribute.id}
                      attributeName={attribute.name}
                      inputId={inputId}
                      hintId={hintId}
                      empty={selectedValues.length === 0}
                      multiple={allowMultipleValuesPerAttribute}
                      onRemove={() => {
                        setSelectedAttributes((current) =>
                          current.filter((item) => item.id !== attribute.id)
                        );
                        updateAttributeValues(attribute, []);
                        setAnnouncement(`${attribute.name} removed.`);
                      }}
                    >
                      <div className="min-w-0">
                        {allowMultipleValuesPerAttribute ? (
                          <Combobox<AttributeValue>
                            id={inputId}
                            aria-describedby={
                              selectedValues.length === 0 ? hintId : undefined
                            }
                            autoFocus={focusAttributeId === attribute.id}
                            name={`attributeValues[${attribute.id}]`}
                            multiple
                            options={attribute.attributeValues}
                            value={selectedValues}
                            getOptionValue={getValueId}
                            getOptionLabel={getValueLabel}
                            onValueChange={(values) =>
                              updateAttributeValues(attribute, values)
                            }
                            placeholder="Select values"
                            emptyText="No values found"
                            size="s"
                          />
                        ) : (
                          <Combobox<AttributeValue>
                            id={inputId}
                            aria-describedby={
                              selectedValues.length === 0 ? hintId : undefined
                            }
                            autoFocus={focusAttributeId === attribute.id}
                            name={`attributeValues[${attribute.id}]`}
                            options={attribute.attributeValues}
                            value={selectedValues[0] ?? null}
                            getOptionValue={getValueId}
                            getOptionLabel={getValueLabel}
                            onValueChange={(value) =>
                              updateAttributeValues(
                                attribute,
                                value ? [value] : []
                              )
                            }
                            placeholder="Select a value"
                            emptyText="No values found"
                            size="s"
                            endAdornment={
                              selectedValues.length > 0 ? (
                                <IconButton
                                  aria-label={`Clear ${attribute.name}`}
                                  onClick={() =>
                                    updateAttributeValues(attribute, [])
                                  }
                                  size="xs"
                                  type="button"
                                >
                                  <X aria-hidden="true" />
                                </IconButton>
                              ) : undefined
                            }
                          />
                        )}
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
                        disabledAttributeIds={selectedAttributes.map(
                          (attribute) => attribute.id
                        )}
                        onValueChange={(attribute) => {
                          if (!attribute) return;
                          if (
                            selectedAttributes.some(
                              (item) => item.id === attribute.id
                            )
                          )
                            return;
                          setSelectedAttributes((current) => [
                            ...current,
                            attribute,
                          ]);
                          setIsAddingAttribute(false);
                          setFocusAttributeId(attribute.id);
                          setAnnouncement(
                            `${attribute.name} added. Select its values.`
                          );
                        }}
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
              </fieldset>
            </Dialog.Content>

            <Dialog.Footer closeButtonLabel="Cancel">
              <Button
                color="primary"
                onClick={() => {
                  onUpdate({
                    attributeValueIds: selectedAttributeValueIds,
                    attributes: selectedAttributes,
                  });
                  onOpenChange(false);
                }}
                type="button"
              >
                Apply changes
              </Button>
            </Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
