import { Button, Dialog, ToggleButton, Typography } from '@ordero/ui';
import { useEffect, useState } from 'react';
import type { EditProductVariantAttributesDialogProps } from './types';

type HandleAttributeValueChangeArgs = {
  attributeValueId: number;
  attributeValueIds: number[];
  pressed: boolean;
};

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
  const selectedAttributeValueIdsSet = new Set(selectedAttributeValueIds);

  useEffect(() => {
    if (open) {
      setSelectedAttributeValueIds(attributeValueIds);
    }
  }, [attributeValueIds, open]);

  const handleAttributeValueChange = ({
    attributeValueId,
    attributeValueIds,
    pressed,
  }: HandleAttributeValueChangeArgs) => {
    setSelectedAttributeValueIds((currentAttributeValueIds) => {
      if (pressed) {
        if (allowMultipleValuesPerAttribute) {
          return currentAttributeValueIds.includes(attributeValueId)
            ? currentAttributeValueIds
            : [...currentAttributeValueIds, attributeValueId];
        }

        const attributeValueIdsSet = new Set(attributeValueIds);

        return [
          ...currentAttributeValueIds.filter(
            (selectedAttributeValueId) =>
              !attributeValueIdsSet.has(selectedAttributeValueId)
          ),
          attributeValueId,
        ];
      }

      return currentAttributeValueIds.filter(
        (selectedAttributeValueId) =>
          selectedAttributeValueId !== attributeValueId
      );
    });
  };

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup size="sm">
            <Dialog.Header>
              <Dialog.Title>
                Edit variant attributes for {productVariantName}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Content scrollable>
              {attributes.length > 0 ? (
                <fieldset
                  aria-label="Variant attribute values"
                  className="m-0 flex flex-col border-0 p-0"
                >
                  {attributes.map((attribute) => {
                    const attributeValueIds = attribute.attributeValues.map(
                      (attributeValue) => attributeValue.id
                    );

                    return (
                      <div
                        className="flex flex-wrap items-center gap-[var(--space-1)] border-t border-[var(--color-grey-32)] py-[var(--space-1)] first:border-t-0 first:pt-0 last:pb-0"
                        key={attribute.id}
                      >
                        <span className="font-medium text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)]">
                          {attribute.name}:
                        </span>
                        {attribute.attributeValues.map((attributeValue) => (
                          <ToggleButton.Item
                            key={attributeValue.id}
                            onPressedChange={(pressed) => {
                              handleAttributeValueChange({
                                attributeValueId: attributeValue.id,
                                attributeValueIds,
                                pressed,
                              });
                            }}
                            pressed={selectedAttributeValueIdsSet.has(
                              attributeValue.id
                            )}
                            size="s"
                            type="button"
                          >
                            {attributeValue.name}
                          </ToggleButton.Item>
                        ))}
                      </div>
                    );
                  })}
                </fieldset>
              ) : (
                <Typography color="text-secondary" variant="body2">
                  No attributes available
                </Typography>
              )}
            </Dialog.Content>

            <Dialog.Footer closeButtonLabel="Cancel">
              <Button
                color="primary"
                onClick={() => {
                  onUpdate(selectedAttributeValueIds);
                  onOpenChange(false);
                }}
                type="button"
              >
                Update
              </Button>
            </Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
