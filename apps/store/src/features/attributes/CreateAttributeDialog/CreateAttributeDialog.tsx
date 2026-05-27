'use client';

import { Button, Dialog } from '@ordero/ui';
import { Minus, Plus } from 'lucide-react';
import { useRef, useState } from 'react';

const attributeNameInputClassName =
  'h-[var(--textfield-outlined-md-height)] w-full rounded-[var(--textfield-outlined-radius)] border border-input bg-background px-[var(--textfield-outlined-px)] text-[length:var(--input-value-size-desktop)] leading-[var(--input-value-line-height-desktop)] font-[var(--input-value-weight)] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-[var(--text-disabled)] focus-visible:ring-3 focus-visible:ring-ring/50';

const attributeValueInputClassName =
  'h-[var(--textfield-outlined-sm-height)] w-full rounded-[var(--textfield-outlined-radius)] border border-[var(--text-primary)] bg-background px-[var(--textfield-outlined-px)] text-[length:var(--input-value-size-desktop)] leading-[var(--input-value-line-height-desktop)] font-[var(--input-value-weight)] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-[var(--text-disabled)] focus-visible:ring-3 focus-visible:ring-ring/50';

const valueActionButtonClassName =
  'flex size-[var(--textfield-outlined-sm-height)] shrink-0 items-center justify-center rounded-[var(--button-radius)] border border-[var(--color-primary-48)] bg-background text-[var(--color-primary-main)] outline-none transition-[background-color,border-color,color,box-shadow] hover:bg-[var(--color-primary-8)] focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:border-[var(--border)] disabled:text-[var(--text-disabled)] disabled:hover:bg-background';

type AttributeValueRow = {
  id: number;
  value: string;
};

export const CreateAttributeDialog = () => {
  const attributeValueIdRef = useRef(0);
  const createAttributeValueRow = (value: string): AttributeValueRow => ({
    id: attributeValueIdRef.current++,
    value,
  });
  const [open, setOpen] = useState(false);
  const [attributeName, setAttributeName] = useState('');
  const [attributeValues, setAttributeValues] = useState<AttributeValueRow[]>(
    []
  );
  const [pendingAttributeValue, setPendingAttributeValue] = useState('');

  const resetForm = () => {
    setAttributeName('');
    setAttributeValues([]);
    setPendingAttributeValue('');
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      resetForm();
    }
  };

  const handleValueChange = ({ id, value }: { id: number; value: string }) => {
    setAttributeValues((currentValues) =>
      currentValues.map((currentValue) =>
        currentValue.id === id
          ? {
              ...currentValue,
              value,
            }
          : currentValue
      )
    );
  };

  const handleValueRemove = ({ id }: { id: number }) => {
    setAttributeValues((currentValues) =>
      currentValues.filter((currentValue) => currentValue.id !== id)
    );
  };

  const handlePendingValueAdd = () => {
    const nextValue = pendingAttributeValue.trim();

    if (!nextValue) {
      return;
    }

    setAttributeValues((currentValues) => [
      ...currentValues,
      createAttributeValueRow(nextValue),
    ]);
    setPendingAttributeValue('');
  };

  const normalizedAttributeValues = [
    ...attributeValues.map((value) => value.value.trim()),
    pendingAttributeValue.trim(),
  ].filter(Boolean);

  const canCreate =
    attributeName.trim().length > 0 && normalizedAttributeValues.length > 0;

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)} size="m">
        Create Attribute
      </Button>

      <Dialog.Root onOpenChange={handleOpenChange} open={open}>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup size="xs">
              <form
                noValidate
                onSubmit={(event) => {
                  event.preventDefault();

                  if (!canCreate) {
                    return;
                  }

                  setOpen(false);
                  resetForm();
                }}
              >
                <Dialog.Header>
                  <Dialog.Title>Create new attribute</Dialog.Title>
                </Dialog.Header>

                <Dialog.Content>
                  <div className="flex flex-col gap-[var(--space-2)]">
                    <input
                      aria-label="Attribute name"
                      className={attributeNameInputClassName}
                      onChange={(event) => setAttributeName(event.target.value)}
                      placeholder="Color"
                      value={attributeName}
                    />

                    <section className="flex flex-col gap-[var(--space-1-5)] rounded-[var(--radius)] bg-[var(--background-neutral)] p-[var(--space-1-25)]">
                      <p className="text-[length:var(--input-value-size-desktop)] leading-[var(--input-value-line-height-desktop)] font-[var(--input-value-weight)] text-foreground">
                        Attribute values
                      </p>

                      <div className="flex flex-col gap-[var(--space-0-5)]">
                        {attributeValues.map((attributeValue, index) => (
                          <div
                            className="flex items-start gap-[var(--space-0-5)]"
                            key={attributeValue.id}
                          >
                            <input
                              aria-label={`Attribute value ${index + 1}`}
                              className={attributeValueInputClassName}
                              onChange={(event) =>
                                handleValueChange({
                                  id: attributeValue.id,
                                  value: event.target.value,
                                })
                              }
                              value={attributeValue.value}
                            />

                            <button
                              aria-label={`Remove attribute value ${index + 1}`}
                              className={valueActionButtonClassName}
                              onClick={() =>
                                handleValueRemove({ id: attributeValue.id })
                              }
                              type="button"
                            >
                              <Minus className="size-[var(--button-sm-icon)]" />
                            </button>
                          </div>
                        ))}

                        <div className="flex items-start gap-[var(--space-0-5)]">
                          <input
                            aria-label="New attribute value"
                            className={attributeValueInputClassName}
                            onChange={(event) =>
                              setPendingAttributeValue(event.target.value)
                            }
                            onKeyDown={(event) => {
                              if (event.key !== 'Enter') {
                                return;
                              }

                              event.preventDefault();
                              handlePendingValueAdd();
                            }}
                            placeholder="Attribute value"
                            value={pendingAttributeValue}
                          />

                          <button
                            aria-label="Add attribute value"
                            className={valueActionButtonClassName}
                            disabled={pendingAttributeValue.trim().length === 0}
                            onClick={handlePendingValueAdd}
                            type="button"
                          >
                            <Plus className="size-[var(--button-sm-icon)]" />
                          </button>
                        </div>
                      </div>
                    </section>
                  </div>
                </Dialog.Content>

                <Dialog.Footer hideCloseButton>
                  <Dialog.Close size="s" variant="outlined">
                    Cancel
                  </Dialog.Close>
                  <Button
                    color="primary"
                    disabled={!canCreate}
                    size="s"
                    type="submit"
                  >
                    Create
                  </Button>
                </Dialog.Footer>
              </form>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
